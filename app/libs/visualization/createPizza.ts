"use client";
import { Selection, select } from "d3-selection";
import { pie, arc } from "d3-shape";

import { pallet } from "../colorPallet";
import * as Comlink from "comlink";
import { BackgroundWorker } from "@/app/dedicated-workers/backgroundWorker";
import { FrameWorker } from "@/app/dedicated-workers/framWorker";
import { ShapeWorker } from "@/app/dedicated-workers/shapeWorker";

function createPizza() {
	let data: any[],
		primaryColumn: string,
		sliceColumn: string,
		ringColumn: string,
		ratio: number,
		ringSet: any[],
		sliceSet: any[],
		margin: { top: number; right: number; bottom: number; left: number },
		canvasWidth: number,
		canvasHeight: number,
		updateData: () => void,
		updateSliceColumn: () => void,
		updateRingColumn: () => void,
		updateRingSet: () => void,
		updateSliceSet: () => void;

	function chart(selection: Selection<HTMLDivElement, unknown, null, undefined>) {
		selection.each(async function () {
			const backgroundCanvas = select(this).select("#background").node() as HTMLCanvasElement,
				shapesCanvas = select(this).select("#shapes").node() as HTMLCanvasElement,
				webglCanvas = select(this).select("#webgl").node() as HTMLCanvasElement,
				outsideHeight = margin.top + margin.bottom,
				insideHeight = canvasHeight - outsideHeight,
				diameterRatio = 0.85,
				pieDiameter = diameterRatio * insideHeight,
				pieRadius = pieDiameter / 2;
			// accessors
			let ringValue = (d: any): string => d[ringColumn],
				sliceValue = (d: any) => d[sliceColumn],
				// metrics
				ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length])),
				sliceCount = Object.fromEntries(sliceSet.map((slice) => [slice, data.filter((d) => sliceValue(d) === slice).length])),
				ringHeights = ringSet.reduce<{ [key: string]: { innerRadius: number; outerRadius: number } }>((acc, ring, i) => {
					const height = ringCount[ring]! * (pieRadius / data.length);
					if (i === 0) {
						acc[ring] = { innerRadius: 0, outerRadius: height };
					} else {
						const prev = ringSet[i - 1];
						const { outerRadius: prevOuter } = acc[prev!] || { outerRadius: 0 };
						const outerRadius = height + prevOuter;
						acc[ring] = { innerRadius: prevOuter, outerRadius };
					}
					return acc;
				}, {}),
				// generators
				pieGenerator = pie<string>()
					.value((slice: string) => sliceCount[slice]!)
					.sort((a: string, b: string) => sliceSet.indexOf(a) - sliceSet.indexOf(b)),
				sliceAngles = Object.fromEntries(
					pieGenerator(sliceSet).map((p) => {
						const { startAngle, endAngle } = p;
						return [p.data, { startAngle, endAngle }];
					})
				),
				// slice color pallet
				colorPallet = pallet(Math.max(ringSet.length, 8)),
				sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]])),
				// flags
				resetRings = false,
				resetSlices = false;

			// sort data according to the slice and ring sets
			data.sort((a, b) => sliceSet.indexOf(sliceValue(a)) - sliceSet.indexOf(sliceValue(b)) || ringSet.indexOf(ringValue(a)) - ringSet.indexOf(ringValue(b)));

			// workers
			const SWorker: Comlink.Remote<typeof ShapeWorker> = Comlink.wrap(
				new Worker(new URL("../../dedicated-workers/shapeWorker.ts", import.meta.url), { type: "module" })
			);
			const shapeWorker = await new SWorker();
			const offfscreenShapesCanvas = shapesCanvas.transferControlToOffscreen();
			const offScreenGLCanvas = webglCanvas.transferControlToOffscreen();
			shapeWorker.transferShapeCanvas(Comlink.transfer(offfscreenShapesCanvas, [offfscreenShapesCanvas]));
			shapeWorker.transferGLCanvas(Comlink.transfer(offScreenGLCanvas, [offScreenGLCanvas]));
			const FWorker: Comlink.Remote<typeof FrameWorker> = Comlink.wrap(
				new Worker(new URL("../../dedicated-workers/framWorker.ts", import.meta.url), { type: "module" })
			);
			const frameWorker = await new FWorker(sliceAngles, ringHeights, sliceColors);
			const BWorker: Comlink.Remote<typeof BackgroundWorker> = Comlink.wrap(
					new Worker(new URL("../../dedicated-workers/backgroundWorker.ts", import.meta.url), { type: "module" })
				),
				backgroundWorker = await new BWorker(ratio),
				offscreenBackgroundCanvas = backgroundCanvas.transferControlToOffscreen();

			backgroundWorker.transferCanvas(Comlink.transfer(offscreenBackgroundCanvas, [offscreenBackgroundCanvas]));

			const cb = async (input: Section[][]) => {
				backgroundWorker.addTransitions(input);
				backgroundWorker.dequeue();
				for (const section of input[input.length - 1]) {
					section.count = data.filter(
						(d) => (sliceValue(d) ? sliceValue(d) === section.slice : true) && (ringValue(d) ? ringValue(d) === section.ring : true)
					).length;
				}
				await shapeWorker.addSections(input[input.length - 1], Comlink.proxy(arc<Section>()));
				shapeWorker.updateShapeData(data.map((d) => d[primaryColumn]));
			};

			frameWorker.getFrames(Comlink.proxy(cb));

			// update handlers
			updateData = function () {
				data.sort((a, b) => sliceSet.indexOf(sliceValue(a)) - sliceSet.indexOf(sliceValue(b)) || ringSet.indexOf(ringValue(a)) - ringSet.indexOf(ringValue(b)));
				const cb = async (input: Section[][]) => {
					backgroundWorker.changeEase("easeLinear");
					backgroundWorker.changeTransitionDuration(300 / input.length);
					backgroundWorker.addTransitions(input);
					backgroundWorker.dequeue();
					backgroundWorker.changeEase("easeIdentitiy");
					backgroundWorker.changeTransitionDuration(300);

					for (const section of input[input.length - 1]) {
						section.count = data.filter(
							(d) => (sliceValue(d) ? sliceValue(d) === section.slice : true) && (ringValue(d) ? ringValue(d) === section.ring : true)
						).length;
					}
					console.log(input[input.length - 1]);
					await shapeWorker.addSections(input[input.length - 1], Comlink.proxy(arc<Section>()));
					shapeWorker.updateShapeData(data.map((d) => d[primaryColumn]));
				};
				// When the data changes the slices and rings need to be updated.
				// Many of the calculations are redundant with those in the updateSliceSet and updateRingSet functions.
				// Update data could simply call those functions.
				// But doing the calculations here allows for batching the transitions to reduce jank.
				sliceCount = Object.fromEntries(sliceSet.map((slice) => [slice, data.filter((d) => sliceValue(d) === slice).length]));
				ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length]));
				sliceAngles = Object.fromEntries(
					pieGenerator(sliceSet).map((p) => {
						const { startAngle, endAngle } = p;
						return [p.data, { startAngle, endAngle }];
					})
				);
				ringHeights = ringSet.reduce<{ [key: string]: { innerRadius: number; outerRadius: number } }>((acc, ring, i) => {
					const height = ringCount[ring]! * (pieRadius / data.length);
					if (i === 0) {
						acc[ring] = { innerRadius: 0, outerRadius: height };
					} else {
						const prev = ringSet[i - 1];
						const { outerRadius: prevOuter } = acc[prev!] || { outerRadius: 0 };
						const outerRadius = height + prevOuter;
						acc[ring] = { innerRadius: prevOuter, outerRadius };
					}
					return acc;
				}, {});
				frameWorker.updateSliceAngles(sliceAngles);
				frameWorker.updateRingHeights(ringHeights);
				frameWorker.getFrames(Comlink.proxy(cb));
			};

			updateRingColumn = function () {
				// Unlike the slices the rings need to be transitioned one at a time.
				// So Every ring should get its own animated transition.
				// However, this can be very slow for large ring sets.
				// In theory, changing the duration for each ring transition to a precentage of half a resonable duration
				// should make the total transition time reasonable.
				// In practice, this is not the case when the ring set is over about 30 rings.
				// This discrepancy could be cause by a large number of d3 transition updates happening in rapid succession.
				// For now the solution is to chunk the ring transitions into a few groups when the ring set is large.

				const cb = (input: Section[][]) => {
					backgroundWorker.changeTransitionDuration(Math.round(200 / input.length));
					backgroundWorker.addTransitions(input);
				};

				let chunkSize = Math.max(Math.round(ringSet.length / 10), 1);
				ringValue = (d: any) => d[ringColumn];
				const ringExistTransitions: { [ring: string]: { innerRadius: number; outerRadius: number } }[] = [];
				for (let i = 0; i < ringSet.length; i += chunkSize) {
					const ringExist: { [ring: string]: { innerRadius: number; outerRadius: number } } = {};
					for (let j = i; j < ringSet.length; j++) {
						const ring = ringSet[j];
						const { outerRadius, innerRadius } = ringHeights[ring]!;
						// Transition the current ring to its outer radius, on this step.
						// Remove the ring on the next step.
						if (j === i || j < i + chunkSize) {
							ringExist[ring] = { innerRadius: outerRadius, outerRadius };
						} else {
							ringExist[ring] = { innerRadius, outerRadius };
						}
					}
					ringExistTransitions.push(ringExist);
				}
				ringExistTransitions.forEach((ringExit) => {
					frameWorker.updateRingHeights(ringExit);
				});
				frameWorker.getFrames(Comlink.proxy(cb));
				ringCount = {};
				ringHeights = {};
				resetRings = true;
			};

			updateRingSet = function () {
				data.sort((a, b) => sliceSet.indexOf(sliceValue(a)) - sliceSet.indexOf(sliceValue(b)) || ringSet.indexOf(ringValue(a)) - ringSet.indexOf(ringValue(b)));
				const cb = (update: boolean) => async (input: Section[][]) => {
					if (update) backgroundWorker.changeTransitionDuration(Math.round(200 / input.length));
					backgroundWorker.addTransitions(input);
					backgroundWorker.dequeue();
					backgroundWorker.changeTransitionDuration(300);
					if (update) {
						for (const section of input[input.length - 1]) {
							section.count = data.filter(
								(d) => (sliceValue(d) ? sliceValue(d) === section.slice : true) && (ringValue(d) ? ringValue(d) === section.ring : true)
							).length;
						}
						await shapeWorker.addSections(input[input.length - 1], Comlink.proxy(arc<Section>()));
						shapeWorker.updateShapeData(data.map((d) => d[primaryColumn]));
					}
				};
				if (resetRings) {
					colorPallet = pallet(Math.max(ringSet.length, 8));
					sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
					frameWorker.updateSliceColors(sliceColors);
					ringHeights = Object.fromEntries(ringSet.map((ring) => [ring, { innerRadius: 0, outerRadius: 0 }]));
					ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length]));
					const ringHeightEnterTransition: { [ring: string]: { innerRadius: number; outerRadius: number } }[] = [];
					// See the comments in updateRingColumn for an explanation of the chunking.
					const chunkSize = Math.max(Math.round(ringSet.length / 10), 1);
					for (let i = 0; i < ringSet.length; i += chunkSize) {
						for (let j = i; j < i + chunkSize; j++) {
							// on this step transition the current ring from a height of 0, at the outer most ring's outer radius, to its full height
							const ring = ringSet[j];
							const height = ringCount[ring]! * (pieRadius / data.length);
							const innerRadius = j > 0 ? ringHeights[ringSet[j - 1]].outerRadius : 0;
							const outerRadius = innerRadius + height;
							ringHeights[ring] = { innerRadius, outerRadius };
						}
						for (let j = i + chunkSize; j < ringSet.length; j++) {
							// the remaining rings should be at a height of 0, at the outer radius of the outer most ring in the chunk.
							const ring = ringSet[j];
							ringHeights[ring] = { innerRadius: ringHeights[ringSet[j - 1]].outerRadius, outerRadius: ringHeights[ringSet[j - 1]].outerRadius };
						}
						ringHeightEnterTransition.push({ ...ringHeights });
					}
					ringHeightEnterTransition.forEach((ringEnter) => {
						frameWorker.updateRingHeights(ringEnter);
					});
				} else {
					ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length]));
					ringHeights = ringSet.reduce<{ [key: string]: { innerRadius: number; outerRadius: number } }>((acc, ring, i) => {
						const height = ringCount[ring]! * (pieRadius / data.length);
						if (i === 0) {
							acc[ring] = { innerRadius: 0, outerRadius: height };
						} else {
							const prev = ringSet[i - 1];
							const { outerRadius: prevOuter } = acc[prev!] || { outerRadius: 0 };
							const outerRadius = height + prevOuter;
							acc[ring] = { innerRadius: prevOuter, outerRadius };
						}
						return acc;
					}, {});
					frameWorker.updateRingHeights(ringHeights);
				}
				frameWorker.getFrames(Comlink.proxy(cb(resetRings)));
				resetRings = false;
			};

			updateSliceColumn = function () {
				const cb = (input: Section[][]) => {
					backgroundWorker.changeTransitionDuration(200);
					// d3 ease functions cause jank when there are a lot of slices.
					backgroundWorker.changeEase(sliceSet.length < 50 ? "easeQuadOut" : "easeIdentitiy");
					backgroundWorker.addTransitions(input);
				};
				sliceValue = (d: any) => d[sliceColumn];
				data.sort((a, b) => sliceSet.indexOf(sliceValue(a)) - sliceSet.indexOf(sliceValue(b)) || ringSet.indexOf(ringValue(a)) - ringSet.indexOf(ringValue(b)));
				sliceCount = {};
				sliceSet.forEach((slice) => {
					sliceAngles[slice] = { startAngle: (Math.PI * 360) / 180, endAngle: (Math.PI * 360) / 180 };
				});
				frameWorker.updateSliceAngles(sliceAngles);
				frameWorker.getFrames(Comlink.proxy(cb));
				sliceAngles = {};
				sliceCount = {};
				resetSlices = true;
			};

			updateSliceSet = function () {
				data.sort((a, b) => sliceSet.indexOf(sliceValue(a)) - sliceSet.indexOf(sliceValue(b)) || ringSet.indexOf(ringValue(a)) - ringSet.indexOf(ringValue(b)));
				const cb = (update: boolean) => async (input: Section[][]) => {
					// d3 ease functions causes jank when there are a lot of slices.
					backgroundWorker.changeEase(sliceSet.length < 50 ? (update ? "easeQuadIn" : "easeQuad") : "easeIdentitiy");
					backgroundWorker.changeTransitionDuration(200);
					backgroundWorker.addTransitions(input);
					backgroundWorker.dequeue();
					backgroundWorker.changeEase("easeIdentitiy");
					backgroundWorker.changeTransitionDuration(300);
					if (update) {
						for (const section of input[input.length - 1]) {
							section.count = data.filter(
								(d) => (sliceValue(d) ? sliceValue(d) === section.slice : true) && (ringValue(d) ? ringValue(d) === section.ring : true)
							).length;
						}
						await shapeWorker.addSections(input[input.length - 1], Comlink.proxy(arc<Section>()));
						shapeWorker.updateShapeData(data.map((d) => d[primaryColumn]));
					}
				};
				if (resetSlices) {
					data.sort(
						(a, b) => sliceSet.indexOf(sliceValue(a)) - sliceSet.indexOf(sliceValue(b)) || ringSet.indexOf(ringValue(a)) - ringSet.indexOf(ringValue(b))
					);
					// d3 ease functions cause jank when there are a lot of slices.
					sliceSet.forEach((slice) => {
						sliceAngles[slice] = { startAngle: 0, endAngle: 0 };
					});
					sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
					frameWorker.updateSliceColors(sliceColors);
					frameWorker.updateSliceAngles(sliceAngles);
				}
				sliceCount = Object.fromEntries(sliceSet.map((slice) => [slice, data.filter((d) => sliceValue(d) === slice).length]));
				pieGenerator = pie<string>()
					.value((slice: string) => sliceCount[slice]!)
					.sort((a: string, b: string) => sliceSet.indexOf(a) - sliceSet.indexOf(b));
				sliceAngles = Object.fromEntries(
					pieGenerator(sliceSet).map((p) => {
						const { startAngle, endAngle } = p;
						return [p.data, { startAngle, endAngle }];
					})
				);
				frameWorker.updateSliceAngles(sliceAngles);
				frameWorker.getFrames(Comlink.proxy(cb(resetSlices)));
				resetSlices = false;
			};
		});
	}

	chart.data = function (value: any) {
		data = value;
		if (typeof updateData === "function") updateData();
		return chart;
	};

	chart.primaryColumn = function (value: string) {
		primaryColumn = value;
		return chart;
	};

	chart.sliceColumn = function (value: string) {
		sliceColumn = value;
		if (typeof updateSliceColumn === "function") updateSliceColumn();
		return chart;
	};

	chart.ringColumn = function (value: string) {
		ringColumn = value;
		if (typeof updateRingColumn === "function") updateRingColumn();
		return chart;
	};

	chart.ringSet = function (value: string[]) {
		ringSet = value;
		if (typeof updateRingSet === "function") updateRingSet();
		return chart;
	};

	chart.sliceSet = function (value: string[]) {
		sliceSet = value;
		if (typeof updateSliceSet === "function") updateSliceSet();
		return chart;
	};

	chart.margin = function (value: { top: number; right: number; bottom: number; left: number }) {
		margin = value;
		return chart;
	};

	chart.canvasWidth = function (value: number) {
		canvasWidth = value;
		return chart;
	};

	chart.canvasHeight = function (value: number) {
		canvasHeight = value;
		return chart;
	};

	chart.ratio = function (value: number) {
		ratio = value;
		return chart;
	};

	return chart;
}

export { createPizza };
