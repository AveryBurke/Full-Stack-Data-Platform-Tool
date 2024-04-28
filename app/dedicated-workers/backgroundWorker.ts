import * as Comlink from "comlink";
import { arc } from "d3-shape";
// import colorPallet from "../libs/colorPallet";
//@ts-ignore
import { parseHTML } from "linkedom/worker";
import { select } from "d3-selection";
import { interpolate } from "d3-interpolate";
import { BackgroundRenderer } from "../libs/visualization/backgroundRenderer";
import { Queue } from "../libs/queue";

class BackgroundWorker {
	ratio: number;
	pallet: { [slice: string]: string[] } = {};
	customElement: HTMLElement;
	backgroundRenderer: BackgroundRenderer;
	arcGenerator = arc<any>();
	canavas: OffscreenCanvas | null = null;
	ctx: OffscreenCanvasRenderingContext2D | null = null;
	ringHeights: { [key: string]: { innerRadius: number; outerRadius: number } } = {};
	sliceAngles: { [key: string]: { startAngle: number; endAngle: number } } = {};
	sliceColors: { [key: string]: string } = {};
	arcs: Section[] = [];
	queue = new Queue<QueueJob>();

	constructor(
		sliceAngles: { [key: string]: { startAngle: number; endAngle: number } },
		ringHeights: { [key: string]: { innerRadius: number; outerRadius: number } },
		ratio: number = 1,
		sliceColors: { [key: string]: string }
	) {
		function JSDOM(html: string) {
			return parseHTML(html);
		}

		const { document } = new (JSDOM as any)("<!DOCTYPE html><html><head></head><body></body></html>");
		this.customElement = document.body.appendChild(document.createElement("custom"));
		console.log("slice angles", sliceAngles);
		console.log("ring heights", ringHeights);
		console.log("slice colors", sliceColors);
		this.ratio = ratio;
		this.sliceAngles = sliceAngles;
		this.ringHeights = ringHeights;
		this.sliceColors = sliceColors;
		this.updateArcs();
		this.backgroundRenderer = new BackgroundRenderer(this.customElement, interpolate, arc(), this.dequeue);
		this.backgroundRenderer.addDrawMethod(this.draw);
		this.backgroundRenderer.updateData(this.arcs);
		this.backgroundRenderer.render();
	}

	transferCanvas(canvas: OffscreenCanvas) {
		this.canavas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	updateSliceAngles = (sliceAngles: { [slice: string]: { startAngle: number; endAngle: number } }) => {
		console.log("slice angles ", sliceAngles);
		this.sliceAngles = sliceAngles;
		this.updateArcs();
		this.queue.enqueue({ type: "transition", payload: this.arcs });
	};

	updateRingHeights = (ringHeights: { [ring: string]: { innerRadius: number; outerRadius: number } }) => {
		console.log("ring heights ", ringHeights);
		this.ringHeights = ringHeights;
		this.updateArcs();
		this.queue.enqueue({ type: "transition", payload: this.arcs });
	};

	updateSliceColors = (sliceColors: { [slice: string]: string }) => {
		this.sliceColors = sliceColors;
	};

	dequeue = () => {
		const job = this.queue.dequeue();
        if (job){
            switch (job.type) {
                case "transition":
                    this.backgroundRenderer.updateData(job.payload);
                    this.backgroundRenderer.render();
                    break;
                case "time":
                    this.backgroundRenderer.changeTransitionDuration(job.payload);
                    this.dequeue();
                    break;
            }
        }
	};

    changeTransitionDuration = (duration: number) => {
        this.queue.enqueue({type: "time", payload: duration});
    };

	queueSize = () => {
		return this.queue.size();
	};

	private updateArcs() {
		const sliceSet = Object.keys(this.sliceAngles);
		const ringSet = Object.keys(this.ringHeights);
		this.arcs = sliceSet
			.map((slice, i) => {
				const { startAngle, endAngle } = this.sliceAngles[slice]!;
				const pallet = this.sliceColors[slice];
				return ringSet.map((ring, j) => {
					const { innerRadius, outerRadius } = this.ringHeights[ring]!;
					return {
						id: `${ring}-${slice}`,
						startAngle,
						endAngle,
						innerRadius,
						outerRadius,
						fill: pallet[j % pallet.length],
					};
				});
			})
			.flat();
	}

	draw = () => {
		const { customElement, ctx, canavas, ratio } = this;
		if (ctx && canavas) {
			const canvasWidth = canavas.width;
			const canvasHeight = canavas.height;
			ctx.save();
			ctx.clearRect(0, 0, canvasWidth * ratio, canvasHeight * ratio);
			ctx.lineWidth = 0.75;
			ctx.setTransform(1, 0, 0, 1, Math.floor(canvasWidth) / 2, Math.floor(canvasHeight) / 2);
			select(customElement)
				.selectAll("custom.section")
				.each(function (d: any, i) {
					const path = select(this).select("path"),
						fill = path.attr("fill"),
						opacity = +path.attr("opacity"),
						svgPath = path.attr("d");
					ctx.strokeStyle = "#000000";
					ctx.fillStyle = fill;
					if (svgPath) {
						ctx.stroke(new Path2D(svgPath));
						ctx.fill(new Path2D(svgPath));
					}
				});
			ctx.restore();
		}
	};
}
export { BackgroundWorker };
Comlink.expose(BackgroundWorker);
