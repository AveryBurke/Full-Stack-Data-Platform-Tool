import * as Comlink from "comlink";
import { arc } from "d3-shape";
//@ts-ignore
import { parseHTML } from "linkedom/worker";
import { select } from "d3-selection";
import { interpolate } from "d3-interpolate";
import { BackgroundRenderer } from "../libs/visualization/backgroundRenderer";
import { Queue } from "../libs/queue";

class BackgroundWorker {
	ratio: number;
	customElement: HTMLElement;
	backgroundRenderer: BackgroundRenderer;
	arcGenerator = arc<any>();
	canavas: OffscreenCanvas | null = null;
	ctx: OffscreenCanvasRenderingContext2D | null = null;
	queue = new Queue<QueueJob>();

	constructor(ratio: number = 1) {

		function JSDOM(html: string) {
			return parseHTML(html);
		}

		const { document } = new (JSDOM as any)("<!DOCTYPE html><html><head></head><body></body></html>");
		this.customElement = document.body.appendChild(document.createElement("custom"));
		this.ratio = ratio;
		this.backgroundRenderer = new BackgroundRenderer(this.customElement, interpolate, arc(), this.dequeue);
		this.backgroundRenderer.addDrawMethod(this.draw);
		this.backgroundRenderer.render();
	}

	transferCanvas(canvas: OffscreenCanvas) {
		this.canavas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	dequeue = () => {
		const job = this.queue.dequeue();
		if (job) {
			switch (job.type) {
				case "transition":
					this.backgroundRenderer.updateData(job.payload);
					this.backgroundRenderer.render();
					break;
				case "time":
					this.backgroundRenderer.changeTransitionDuration(job.payload);
					this.dequeue();
					break;
				case "ease":
					this.backgroundRenderer.changeEase(job.payload);
					this.dequeue();
					break;
			}
		}
	};

	async getArcs(cb: (input: string) => void) {}

	changeTransitionDuration = (duration: number) => {
		this.queue.enqueue({ type: "time", payload: duration });
	};

	changeEase = (ease: Easing) => {
		this.queue.enqueue({ type: "ease", payload: ease });
	};

	addTransitions = (transitions: Section[][]) => {
		for (const transition of transitions) {
			this.queue.enqueue({ type: "transition", payload: transition });
		}
	};

	queueSize = () => {
		return this.queue.size();
	};

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
