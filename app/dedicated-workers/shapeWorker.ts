import svgPathCommander from "svg-path-commander";
import partitionNumber from "../static/particianNumber";
import { ShapeRenderer } from "../libs/visualization/shapeRenderer";
import rotateCoordinates from "../libs/rotateCoordinates";
import { Lloyd } from "@/app/libs/webgl/llyod/lloyd";
import { select } from "d3-selection";
import { InternMap } from "d3-array";
import { genColor } from "../libs/genColor";
//@ts-ignore
import { parseHTML } from "linkedom/worker";

import earcut from "earcut";
import * as Comlink from "comlink";

class ShapeWorker {
	dragging = false;
	draggedShape: string | null = null;
	generateColor = genColor();
	hiddenColorToId: { [color: string]: string } = {};
	previousStreamChunk: number = 0;
	currentShape = 0;
	currentCount = 0;
	currentSection = 0;
	shapesById: { [id: string]: ShapeDatum } = {};
	customElement: HTMLElement;
	shapeRenderer: InstanceType<typeof ShapeRenderer>;
	lloyd: InstanceType<typeof Lloyd> | null = null;
	seeds: number[] = [];
	shapeIdsBySection: InternMap<any, InternMap<string, string[]>> = new InternMap();
	seedBoundryIds: number[] = [];
	sections: Section[] = [];
	sectionIntegerIds: { [sectionID: string]: number } = {};
	boundries: { [sectionID: string]: number[] } = {};
	numPoints: number = 50;
	shapeCanvas: OffscreenCanvas | null = null;
	glCanvas: OffscreenCanvas | null = null;
	hiddenCanvas: OffscreenCanvas | null = null;
	gl: WebGL2RenderingContext | null = null;
	ctx: OffscreenCanvasRenderingContext2D | null = null;
	hiddenCtx: OffscreenCanvasRenderingContext2D | null = null;
	containerWidth = 1122;
	containerHeight = 1122;
	textureWidth = 312;
	textureHeight = 312;
	pxd = 2;
	quad = new Float32Array([
		// First triangle:
		1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
		// Second triangle:
		-1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
	]);

	constructor() {
		function JSDOM(html: string) {
			return parseHTML(html);
		}
		// create a fake document with a custom element and initilize the shapeRenderer
		const { document } = new (JSDOM as any)("<!DOCTYPE html><html><head></head><body></body></html>");
		this.customElement = document.body.appendChild(document.createElement("custom"));
		this.shapeRenderer = new ShapeRenderer(this.customElement, (d: any) => d.d, this.draw, "shape", "easeLinear");
	}

	// this is a slow meothd. Think about streaming these results to voronoi generator.
	// look at some of the methods here https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
	addSections = async (sections: Section[], generator: any) => {
		this.sections = sections;
		this.sectionIntegerIds = {};
		this.boundries = {};
		const toRemove: number[] = [];
		const subsections: Section[] = [];
		// add subsection
		for (let i = 0; i < this.sections.length; i++) {
			const section = this.sections[i];
			if (!section.count) {
				toRemove.push(i);
				continue;
			}

			if (section.count > 100) {
				const partitions = partitionNumber(section.count, Math.ceil(section.count / 200));
				if (partitions) {
					const { startAngle, endAngle, innerRadius, outerRadius, id } = section;
					for (let j = 0; j < partitions.length; j++) {
						const subarcId = id + `_subsection_${j}`;
						const count = partitions[j];
						const theta = endAngle - startAngle;
						const sa = startAngle + j * (theta / partitions.length);
						const ea = startAngle + (j + 1) * (theta / partitions.length);
						subsections.push({ ...section, startAngle: sa, endAngle: ea, innerRadius, outerRadius, id: subarcId, count });
					}
				}
				toRemove.push(i);
			}
		}
		for (let i = toRemove.length - 1; i >= 0; i--) {
			this.sections.splice(toRemove[i], 1);
		}
		this.sections = [...this.sections, ...subsections];
		for await (const section of this.sections) {
			if (!section.count) continue;
			if (!this.sectionIntegerIds[section.id]) {
				this.sectionIntegerIds[section.id] = Object.keys(this.sectionIntegerIds).length + 1;
			}
			const points: number[] = [];
			const triangles: number[] = [];
			// Comlink.proxy is awaitable. But apparently, js doesn't know that.
			const path = await generator(section);
			const length = svgPathCommander.getTotalLength(path || "");

			for (let i = 0; i < this.numPoints; i++) {
				const { x, y } = svgPathCommander.getPointAtLength(path || "", (i / this.numPoints) * length);
				points.push(x, y);
			}
			// earcut expects the points to be in the form of [x1, y1, x2, y2, x3, y3, ...]
			const ears = earcut(points); //<--returns the indexes of the x coordinates of the triangle vertices, in the points array
			for (let i = 0; i < ears.length; i++) {
				const index = ears[i] * 2;
				triangles.push(
					(points[index] / this.containerWidth) * this.pxd,
					(points[index + 1] / this.containerHeight) * this.pxd,
					this.sectionIntegerIds[section.id]
				);
			}
			this.boundries[section.id] = triangles;
		}

		if (this.lloyd) {
			this.lloyd.updateStencil(Object.values(this.boundries).flat());
			this.lloyd.renderStencil();
		}
	};

	/**
	 * Changes the shape data to the new shape data.
	 * This method removes shapes, if the IDs are not in the new shape data,
	 * and adds new shapes if the IDs are not in the old shape data.
	 * It also regenerates possitions for ever shape.
	 * Prefer using `partialUpdateShapeData` if you only need to update the position of the shapes.
	 * @param shapeIdsBySection a list of new shape ids
	 */
	updateShapeData(shapeIdsBySection: InternMap<any, InternMap<string, string[]>>) {
		const incomingIds = [...shapeIdsBySection.values()].map((map) => [...map.values()].flat()).flat();
		const currentIds = Object.keys(this.shapesById);
		for (let i = 0; i < currentIds.length; i++) {
			if (!incomingIds.includes(currentIds[i])) {
				delete this.shapesById[currentIds[i]];
			}
		}
		this.shapeIdsBySection = shapeIdsBySection;
		this.seedSections();
		this.lloyd?.renderInChunks(this.seeds, this.seedBoundryIds);
	}

	/**
	 * Changes only the position of the shapes that have moved.
	 * This method does not remove or add shapes.
	 * Use `updateShapeData` if you need to add or remove shapes.
	 * @param movedshapeIdsBySection the ids of the shapes that have moved
	 */
	partialUpdateShapeData(movedshapeIdsBySection: InternMap<any, InternMap<string, string[]>>) {
		this.shapeIdsBySection = movedshapeIdsBySection;
		this.seedSections();
		this.lloyd?.renderInChunks(this.seeds, this.seedBoundryIds);
	}

	/**
	 * Rotates each shape by the angle of rotation of its parent slice.
	 * @param thetas an object whose keys are the slices and whose values are the angles of roatation per slice.
	 */
	rotateSections(thetas: { [slice: string]: number }) {
		Object.keys(thetas).forEach((slice) => {
			const theta = thetas[slice];
			const sliceShapes = this.shapeIdsBySection.get(slice)?.values();
			if (!sliceShapes) return;
			if (!theta) return;
			for (const shapes of sliceShapes) {
				for (const shape of shapes) {
					const [x, y] = rotateCoordinates(this.shapesById[shape].x, this.shapesById[shape].y, theta);
					this.shapesById[shape].x = x;
					this.shapesById[shape].y = y;
				}
			}
		});
		this.shapeRenderer.updateShapes(Object.values(this.shapesById));
	}

	/**
	 * Seeds the sections with random points.
	 * The number of points in each section is determined by the `count` property of the section.
	 */
	seedSections = () => {
		const seeds: number[] = [];
		const seedBoundryIds: number[] = [];
		for (const section of this.sections) {
			const id = this.sectionIntegerIds[section.id];
			const { startAngle, endAngle, innerRadius, outerRadius, count } = section;
			const arcCount = count || 0;
			for (let i = 0; i < arcCount; ++i) {
				const randomClampedR = Math.random() * (outerRadius - innerRadius) + innerRadius,
					randomClampedTheta = Math.random() * (endAngle - startAngle) + startAngle - Math.PI / 2,
					x = Math.cos(randomClampedTheta) * randomClampedR,
					y = Math.sin(randomClampedTheta) * randomClampedR;
				seeds.push((x / this.containerWidth) * 2, -(y / this.containerHeight) * 2); // <-- is the 2 here on account of the pxd?
				seedBoundryIds.push(id);
			}
		}
		this.seedBoundryIds = seedBoundryIds;
		this.seeds = seeds;
		// console.log("seeds", seeds);
	};

	transferGLCanvas = (canvas: OffscreenCanvas) => {
		this.glCanvas = canvas;
		this.gl = canvas.getContext("webgl2");
		if (!this.gl) {
			throw new Error("WebGL2 not supported");
		}
		this.lloyd = new Lloyd(this.gl, 312, 312, 100, this.handlePositions);
	};

	transferShapeCanvas = (canvas: OffscreenCanvas) => {
		this.shapeCanvas = canvas;
		this.ctx = canvas.getContext("2d", { willReadFrequently: true });
	};

	transferHiddenCanvas = (canvas: OffscreenCanvas) => {
		this.hiddenCanvas = canvas;
		this.hiddenCtx = canvas.getContext("2d", { willReadFrequently: true });
	};

	mouseOut = () => {
		this.dragging = false;
		this.draggedShape = null;
	};

	mouseMove = (x: number, y: number) => {
		// console.log("mouse move", x, y);
		if (!this.shapeCanvas || !this.containerWidth || !this.containerHeight) return;
		
		// console.log("normalizedX", normalizedX);
		// console.log("mouse move", x, y);
		// if (this.dragging && id) this.dragShape(x, y);
		if (this.dragging && this.draggedShape) this.dragShape(this.draggedShape, x, y);
		return this.getShapeByLocation(x, y);
	};

	private getShapeByLocation = (x: number, y: number): string | null => {
		if (!this.hiddenCtx) return null;
		const data = this.hiddenCtx.getImageData(x, y, 1, 1).data;
		return this.hiddenColorToId[`rgb(${data[0]},${data[1]},${data[2]})`] || null;
	};

	private dragShape = (id: string, x: number, y: number) => {
		const { containerWidth, containerHeight, shapeCanvas } = this;
		if (!containerWidth || !containerHeight || !shapeCanvas) return;

		// Normalize the x and y values to the container
		let normalizedX = (x - (shapeCanvas.width - containerWidth) / 2)/containerWidth;
		let normalizedY = (y - (shapeCanvas.height - containerHeight) / 2)/containerHeight;

		// convert x and y to vector space
		// the draw funciton will convert the vector space to the container space
		this.shapeRenderer.dragShape(id, (normalizedX * 2) - 1, -((normalizedY * 2) - 1));
	};

	mouseDown = (x: number, y: number) => {
		this.dragging = true;
		this.draggedShape = this.getShapeByLocation(x, y);
	};

	mouseUp = () => {
		this.dragging = false;
		this.draggedShape = null;
	};

	// Assigns the positions returned from the lloyd relaxation to the shapes.
	// Handles logic for streaming the positions to the shape renderer.
	handlePositions = ({ keepOpen, payload }: { keepOpen: boolean; payload: Float32Array }) => {
		const cmp = (a: number, b: number): number => +(a > b) - +(a < b);
		const debugColors = [
			"red",
			"green",
			"blue",
			"purple",
			"orange",
			"pink",
			"cyan",
			"magenta",
			"lime",
			"coral",
			"indigo",
			"teal",
			"navy",
			"maroon",
			"olive",
			"aqua",
			"fuchsia",
			"silver",
			"gray",
			"black",
			"white",
			"forestgreen",
			"darkorange",
			"darkviolet",
			"darkturquoise",
		];
		// Below we are sorting the x values of the points in their original sections.
		// This is so the points will transition to the closest new position.
		// But we can modifity this to sort by y values within the sections.
		// Futhermore, using an InternMap for the shapeIdsBySection w/r/t the slice and ring menas the shapeId can be sorted in the calling funciton
		const arrayRange = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step);
		let xs = arrayRange(0, payload.length - 1, 2);
		let sortedXIndices: number[] = [];
		let currentSectionId = this.seedBoundryIds[this.previousStreamChunk];
		let start = 0;

		// sort the x values by the section they belong to
		for (let i = 0; i < xs.length; i++) {
			if (currentSectionId !== this.seedBoundryIds[this.previousStreamChunk + i]) {
				const sortedChunk = xs.slice(start, i).sort((a, b) => cmp(payload[a], payload[b]));
				sortedXIndices = sortedXIndices.concat(sortedChunk);
				currentSectionId = this.seedBoundryIds[this.previousStreamChunk + i];
				start = i;
			}
		}

		// sort the last chunk
		const sortedChunk = xs.slice(start).sort((a, b) => cmp(payload[a], payload[b]));
		sortedXIndices = sortedXIndices.concat(sortedChunk);
		this.previousStreamChunk += xs.length;

		// Assign the new positions to the shapes
		for (let i = 0; i < sortedXIndices.length; i++) {
			const { slice, ring, count } = this.sections[this.currentSection];
			const data = this.shapeIdsBySection.get(slice)?.get(ring);
			if (!data || !count) {
				this.currentShape = 0;
				this.currentSection++;
				continue;
			}

			if (!this.currentCount) this.currentCount = count;
			const id = data[this.currentShape];
			const x = payload[sortedXIndices[i]];
			const y = payload[sortedXIndices[i] + 1];
			this.shapesById[id] = { x, y, d: "", fill: "pink", id, fillStyleHidden: this.generateColor() };
			this.hiddenColorToId[this.shapesById[id].fillStyleHidden] = id;
			if (this.currentShape === this.currentCount - 1) {
				const previoiusSection = this.currentSection;
				this.currentSection++;
				if (!this.sections[this.currentSection]) break;
				if (
					this.sections[previoiusSection].ring === this.sections[this.currentSection].ring &&
					this.sections[previoiusSection].slice === this.sections[this.currentSection].slice
				) {
					// we are in the same parent section, but we've hit the end of a subsection
					// do not restart the shape index
					// add the count of the subsection to the current count
					this.currentCount += this.sections[this.currentSection].count || 0;
					this.currentShape++;
				} else {
					// we are in a new parent section
					// restart the shape index
					// set the current count to the count of the new parent section
					this.currentShape = 0;
					this.currentCount = this.sections[this.currentSection].count || 0;
				}
			} else {
				this.currentShape++;
			}
		}

		// Update the shapes in the shape renderer.
		// This will trigger a transition of the shapes to their new positions.
		// We are iterating over the keys of the shapesById object so that shapes that have not moved this iteration are not transitioned or removed.
		this.shapeRenderer.updateShapes(Object.keys(this.shapesById).map((key) => this.shapesById[key]));
		if (!keepOpen) {
			// the last chunk of data hasn't made it out of the shape renderer's enter selection
			this.shapeRenderer.updateShapes(Object.keys(this.shapesById).map((key) => this.shapesById[key]));
			// reset the current shape and section
			this.previousStreamChunk = 0;
			this.currentShape = 0;
			this.currentSection = 0;
			this.currentCount = 0;
		}
	};

	draw = () => {
		if (!this.ctx || !this.shapeCanvas || !this.pxd || !this.containerWidth || !this.containerHeight) return;
		const { ctx, shapeCanvas, pxd, customElement, containerWidth, containerHeight, hiddenCtx, hiddenCanvas } = this;
		ctx.globalAlpha = 1;
		ctx.save();
		ctx.clearRect(0, 0, shapeCanvas.width * pxd, shapeCanvas.height * pxd);
		ctx.lineWidth = 0.75;
		if (hiddenCtx && hiddenCanvas) {
			hiddenCtx.globalAlpha = 1;
			hiddenCtx.save();
			hiddenCtx.clearRect(0, 0, hiddenCanvas.width * pxd, hiddenCanvas.height * pxd);
		}
		console.log("drawing shapes");
		select(customElement)
			.selectAll("custom.shape")
			.each(function (d: any, i) {
				const path = select(this).select("path");
				const x = +path.attr("x");
				const y = +path.attr("y");
				const fill = path.attr("fill");
				const hiddenColor = path.attr("fillStyleHidden");
				const opacity = path.attr("opacity");
				ctx.globalAlpha = +opacity;
				ctx.setTransform(pxd, 0, 0, pxd, (x * containerWidth) / 2 + shapeCanvas.width / 2, -(y * containerHeight) / 2 + shapeCanvas.height / 2);
				ctx.fillStyle = fill;
				ctx.beginPath();
				ctx.arc(0, 0, 5, 0, 2 * Math.PI);
				ctx.fill();
				if (hiddenCtx && hiddenCanvas) {
					hiddenCtx.globalAlpha = 1;
					hiddenCtx.setTransform(pxd, 0, 0, pxd, (x * containerWidth) / 2 + hiddenCanvas.width / 2, -(y * containerHeight) / 2 + hiddenCanvas.height / 2);
					hiddenCtx.fillStyle = hiddenColor;
					hiddenCtx.beginPath();
					hiddenCtx.arc(0, 0, 5, 0, 2 * Math.PI);
					hiddenCtx.fill();
				}
			});
		ctx.restore();
	};
}

Comlink.expose(ShapeWorker);
export { ShapeWorker };
