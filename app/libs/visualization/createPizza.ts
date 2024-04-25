import { Selection, select } from "d3-selection";
import { pie } from "d3-shape";
import { pallet } from "../colorPallet";
import * as Comlink from "comlink";
import { BackgroundWorker } from "@/app/dedicated-workers/backgroundWorker";

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
		updateData: (data: any[]) => void,
		updateSliceColumn: (sliceColumn: string) => void,
		updateRingColumn: (ringColumn: string) => void,
		updateRingSet: (ringSet: string[]) => void,
		updateSliceSet: (sliceSet: string[]) => void;

	function chart(selection: Selection<HTMLDivElement, unknown, null, undefined>) {
		selection.each(async function () {
			const backgroundCanvas = select(this).select("#background").node() as HTMLCanvasElement,
				// ctx = backgroundCanvas.getContext("2d"),
				outsideHeight = margin.top + margin.bottom,
				insideHeight = canvasHeight - outsideHeight,
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
				colorPallet = pallet(ringSet.length),
				sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]))
				// pallet = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));

			const BWorker: Comlink.Remote<typeof BackgroundWorker> = Comlink.wrap(
					new Worker(new URL("../../dedicated-workers/backgroundWorker.ts", import.meta.url), { type: "module" })
				),
				bacgroundWorker = await new BWorker(sliceAngles, ringHeights, ratio, sliceColors),
				offscreenBackgroundCanvas = backgroundCanvas.transferControlToOffscreen();

			bacgroundWorker.transferCanvas(Comlink.transfer(offscreenBackgroundCanvas, [offscreenBackgroundCanvas]));
			bacgroundWorker.draw();

			// update handlers
			updateData = () => {
				console.log("updateData ", data);
			};	

			updateRingColumn = () => {
				bacgroundWorker.changeTransitionDuration(Math.round(150 / ringSet.length));
				ringValue = (d: any) => d[ringColumn];
				const ringExistTransitions = ringSet.reduce<{ [ring: string]: { innerRadius: number; outerRadius: number } }[]>((acc, ring, i) => {
					const remainingRings = ringSet.slice(i);
					const ringExit = Object.fromEntries(
						remainingRings.map((ring, j) => {
							const { outerRadius, innerRadius } = ringHeights[ring]!;
							if (j === 0) return [ring, { innerRadius: outerRadius, outerRadius }];
							return [ring, { innerRadius, outerRadius }];
						})
					);
					acc.push(ringExit);
					return acc;
				}, []);
				ringExistTransitions.forEach((ringExit) => {
					bacgroundWorker.updateRingHeights(ringExit);
				});
				ringCount = {};
				ringHeights = {};
			};

			updateRingSet = () => {
				if (Object.keys(ringCount).length === 0) {
					colorPallet = pallet(ringSet.length);
					sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
					bacgroundWorker.updateSliceColors(sliceColors);
					bacgroundWorker.changeTransitionDuration(Math.round(150 / ringSet.length));
					ringHeights = Object.fromEntries(ringSet.map((ring, i) => [ring, { innerRadius: 0, outerRadius: 0 }]));
					bacgroundWorker.updateRingHeights(ringHeights);
					ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length]));
					const ringHeightEnterTransition = ringSet.reduce<{ [ring: string]: { innerRadius: number; outerRadius: number } }[]>((acc, ring, i) => {
						const remainingRings = ringSet.slice(i + 1);
						const height = ringCount[ring]! * (pieRadius / data.length);
						const innerRadius = i > 0 ? ringHeights[ringSet[i - 1]].outerRadius : 0;
						const outerRadius = innerRadius + height;
						ringHeights[ring] = { innerRadius, outerRadius };
						remainingRings.forEach((ring) => {
							ringHeights[ring] = { innerRadius: outerRadius, outerRadius };
						});
						acc.push({ ...ringHeights });
						return acc;
					}, []);
					ringHeightEnterTransition.forEach((ringEnter) => {
						bacgroundWorker.updateRingHeights(ringEnter);
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
					bacgroundWorker.updateRingHeights(ringHeights);
				}
				bacgroundWorker.changeTransitionDuration(300);
				bacgroundWorker.dequeue();
			};

			updateSliceColumn = () => {
				sliceValue = (d: any) => d[sliceColumn];
				sliceCount = {};
				sliceSet.forEach((slice) => {
					sliceAngles[slice] = { startAngle: (Math.PI * 360) / 180, endAngle: (Math.PI * 360) / 180 };
				});
				bacgroundWorker.updateSliceAngles(sliceAngles);
				sliceAngles = {};
			};

			updateSliceSet = () => {
				// this is hackey.
				// We need a way to transition a new slice set from 0.
				// Therefore update slice set needs to know if this is a new slice set.
				// My current solution is to have a slice column update remove the old slice angles.
				// Then the slice set update will know to transition from 0.
				if (Object.keys(sliceCount).length === 0) {
					sliceSet.forEach((slice) => {
						sliceAngles[slice] = { startAngle: 0, endAngle: 0 };
					});
					sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]))
					bacgroundWorker.updateSliceColors(sliceColors);
					bacgroundWorker.updateSliceAngles(sliceAngles);
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
				bacgroundWorker.updateSliceAngles(sliceAngles);
				bacgroundWorker.dequeue();
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
	};

	return chart;
}

export { createPizza };
