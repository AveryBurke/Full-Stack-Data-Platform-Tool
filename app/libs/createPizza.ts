import { Selection } from "d3-selection";
import { pie, arc } from "d3-shape";
import colorPallet from "./colorPallet";

function createPizza() {
	let data: any[],
		sliceColumn: string,
		ringColumn: string,
		ratio: number,
		ringSet: any[],
		sliceSet: any[],
		margin: { top: number; right: number; bottom: number; left: number },
		canvasWidth: number,
		canvasHeight: number,
		updateData: (data: any[]) => void,
		updateSliceColumn: (sliceColumn: string) => void,
		updateRingColumn: (ringColumn: string) => void,
		updateRingSet: (ringSet: string[]) => void,
		updateSliceSet: (sliceSet: string[]) => void;

	function chart(selection: Selection<HTMLCanvasElement, unknown, null, undefined>) {
		selection.each(function () {

			const ctx = this.getContext("2d"),
				outsideHeight = margin.top + margin.bottom,
				outsideWidth = margin.left + margin.right,
				insideHeight = canvasHeight - outsideHeight,
				insideWidth = canvasWidth - outsideWidth,
				diameterRatio = 0.85,
				pieDiameter = diameterRatio * insideHeight,
				pieRadius = pieDiameter / 2;
			// accessors
			let ringValue = (d: any) => d[ringColumn],
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
				arcGenerator = arc<any>(),
				pieGenerator = pie<string>()
					.value((slice: string) => sliceCount[slice]!)
					.sort((a: string, b: string) => sliceSet.indexOf(a) - sliceSet.indexOf(b)),
				sliceAngles = Object.fromEntries(
					pieGenerator(sliceSet).map((p) => {
						const { startAngle, endAngle } = p;
						return [p.data, { startAngle, endAngle }];
					})
				),
				arcs = sliceSet.map((slice, i) => {
					const { startAngle, endAngle } = sliceAngles[slice]!;
					const pallet = colorPallet[i % colorPallet.length];
					return ringSet.map((ring, j) => {
						const { innerRadius, outerRadius } = ringHeights[ring]!;
						return {
							id: `${ring}-${slice}`,
							startAngle,
							endAngle,
							innerRadius,
							outerRadius,
							fill: pallet[j % pallet.length],
						};
					});
				}).flat(),
				paths = arcs.map((arc) => arcGenerator(arc));
			
			// draw
			if (ctx) {
				ctx.save();
				ctx.clearRect(0, 0, Math.floor(canvasWidth * ratio), Math.floor(canvasHeight * ratio));
				ctx.lineWidth = 0.75;
				ctx.setTransform(1, 0, 0, 1, Math.floor(canvasWidth) / 2, Math.floor(canvasHeight) / 2);
				paths.forEach((path, i) => {
					ctx.strokeStyle = "#000000"
					//@ts-ignore
					ctx.fillStyle = arcs[i].fill;
					if (path) {
						ctx.fill(new Path2D(path))
						ctx.stroke(new Path2D(path))
					};
				});
				ctx.restore();
			}

			updateData = () => {
				console.log("updateData ", data);
			};
			updateRingColumn = () => {
				console.log("updateRingColumn ", ringColumn);
			};
			updateRingSet = () => {
				console.log("updateRingSet ", ringSet);
			};
			updateSliceColumn = () => {
				console.log("updateSliceColumn ", sliceColumn);
			};
			updateSliceSet = () => {
				console.log("updateSliceSet ", sliceSet);
			};
		});
	}

	chart.data = function (value: any) {
		data = value;
		if (typeof updateData === "function") updateData(value);
		return chart;
	};

	chart.sliceColumn = function (value: string) {
		sliceColumn = value;
		if (typeof updateSliceColumn === "function") updateSliceColumn(value);
		return chart;
	};

	chart.ringColumn = function (value: string) {
		ringColumn = value;
		if (typeof updateRingColumn === "function") updateRingColumn(value);
		return chart;
	};

	chart.ringSet = function (value: string[]) {
		ringSet = value;
		if (typeof updateRingSet === "function") updateRingSet(value);
		return chart;
	};

	chart.sliceSet = function (value: string[]) {
		sliceSet = value;
		if (typeof updateSliceSet === "function") updateSliceSet(value);
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
	}

	return chart;
}

export { createPizza };
