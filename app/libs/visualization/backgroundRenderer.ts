import { select, Selection, BaseType } from "d3-selection";
import "d3-transition";
import { timer } from "d3-timer";
import { easeQuad } from "d3-ease";

interface Section {
	id: string;
	innerRadius: number;
	outerRadius: number;
	startAngle: number;
	endAngle: number;
	fill: string;
}

export class BackgroundRenderer {
	duration: number = 300;
    exitDuration: number = 0;
	pathData: Section[] = [];
	customElement: HTMLElement;
	interpolator: (from: any, to: any) => (t: number) => any;
	generator: (d: any) => string | null;
	current: { [key: string]: Section } = {};
	draw: (() => void) | null = null;
	onDrawEnd: (() => void) | null = null;

	constructor(
		curstomElement: HTMLElement,
		interpolator: (from: any, to: any) => (t: number) => any,
		generator: (d: any) => string | null,
		onDrawEnd: (() => void) | null
	) {
		// this.dataContainer = dataContainer;
		this.interpolator = interpolator;
		this.customElement = curstomElement;
		this.generator = generator;
		this.onDrawEnd = onDrawEnd;
	}

	private transition(selection: Selection<HTMLElement, Section, BaseType, unknown>) {

		const { draw, interpolator, generator, current, onDrawEnd, duration } = this;
		
		const t = timer(function (elapsed) {
			const el = Math.min(1, easeQuad(elapsed / (duration + 100)));
			if (draw) draw();
			if (el === 1) t.stop();
		});

		selection
			.select("path")
			.transition("update")
			.duration(duration)
			.attr("opacity", 1)
			.attrTween("d", function (a: Section) {
				const from = { ...current[a.id] };
				const i = interpolator(from, a);
				return (t: number): string => {
					return generator(i(t)) || "";
				};
			})
			.attr("fill", (d) => d.fill)
			.end()
			.catch(() => {
				console.log("rejected ");
			})
			.then(() => {
				selection.each(function (d) {
					current[d.id] = d;
				});
				onDrawEnd && onDrawEnd();
			});
	}

	addDrawMethod(draw: () => void) {
		this.draw = draw;
	}

	updateData(data: Section[]) {
		this.pathData = data;
	}

    changeTransitionDuration(duration: number) {
        this.duration = duration;
    }

	render() {
		const { customElement, current } = this;

		const dataBinding = select(customElement)
			.selectAll<HTMLElement, Section>("custom.section")
			.data(this.pathData, function (d) {
				return d.id || select(this).attr("id");
			});

		this.transition(dataBinding);

		dataBinding
			.enter()
			.append("custom")
			.classed("section", true)
			.attr("id", (section) => section.id)
			.append("path")
			.attr("fill", (section) => section.fill)
			.attr("d", (section) => this.generator(section) || "")
			.attr("opacity", 1)
			.each(function (s) {
				current[s.id] = { ...s };
			});

        // don't exit until the transition is complete
		setTimeout(() => {
			dataBinding
				.exit()
				.each(function () {
					const id = select(this).attr("id");
					delete current[id];
				})
				.remove();
		}, this.exitDuration);
	}
}
