"use client";
import { Selection, select } from "d3-selection";
import { pie } from "d3-shape";
import { easeQuadInOut } from "d3-ease";
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
		updateData: () => void,
		updateSliceColumn: () => void,
		updateRingColumn: () => void,
		updateRingSet: () => void,
		updateSliceSet: () => void;

	function chart(selection: Selection<HTMLDivElement, unknown, null, undefined>) {
		selection.each(async function () {
			const backgroundCanvas = select(this).select("#background").node() as HTMLCanvasElement,
				// ctx = backgroundCanvas.getContext("2d"),
				outsideHeight = margin.top + margin.bottom,
				insideHeight = canvasHeight - outsideHeight,
				diameterRatio = 0.85,
				pieDiameter = diameterRatio * insideHeight,
				pieRadius = pieDiameter / 2,
				easeIdentity = (number: number) => number;
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
				colorPallet = pallet(Math.max(sliceSet.length, 8)),
				sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]])),
				resetRings = false,
				resetSlices = false;

			const BWorker: Comlink.Remote<typeof BackgroundWorker> = Comlink.wrap(
					new Worker(new URL("../../dedicated-workers/backgroundWorker.ts", import.meta.url), { type: "module" })
				),
				bacgroundWorker = await new BWorker(sliceAngles, ringHeights, ratio, sliceColors),
				offscreenBackgroundCanvas = backgroundCanvas.transferControlToOffscreen();

			bacgroundWorker.transferCanvas(Comlink.transfer(offscreenBackgroundCanvas, [offscreenBackgroundCanvas]));
			bacgroundWorker.dequeue();

			// update handlers
			updateData = function () {
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
				bacgroundWorker.updateSliceAngles(sliceAngles);
				bacgroundWorker.updateRingHeights(ringHeights);
				bacgroundWorker.changeTransitionDuration(200 / ringSet.length + 200 / sliceSet.length);
				bacgroundWorker.dequeue();
				bacgroundWorker.changeTransitionDuration(300);
			};

			updateRingColumn = function () {
				// Every ring should get its own animated transition.
				// However, this can be very slow for large ring sets.
				// In theory, changing the duration for each ring transition to a precentage of half a resonable duration
				// should make the total transition time reasonable.
				// In practice, this is not the case when the ring set is over about 30 rings.
				// This discrepancy could be cause by a large number of d3 transition updates happening in rapid succession.
				// For now the solution is to chunk the ring transitions into a few group transitions, when the ring set is large.
				let chunkSize = Math.max(Math.round(ringSet.length / 10), 1);
				bacgroundWorker.changeTransitionDuration(Math.round(200 / ringSet.length));
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
					bacgroundWorker.updateRingHeights(ringExit);
				});
				ringCount = {};
				ringHeights = {};
				resetRings = true;
			};

			updateRingSet = function () {
				if (resetRings) {
					colorPallet = pallet(Math.max(ringSet.length, 8));
					sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
					bacgroundWorker.updateSliceColors(sliceColors);
					bacgroundWorker.changeTransitionDuration(Math.round(200 / ringSet.length));
					ringHeights = Object.fromEntries(ringSet.map((ring) => [ring, { innerRadius: 0, outerRadius: 0 }]));
					bacgroundWorker.updateRingHeights(ringHeights);
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
						bacgroundWorker.updateRingHeights(ringEnter);
					});
					resetRings = false;
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

			updateSliceColumn = function () {
				sliceValue = (d: any) => d[sliceColumn];
				sliceCount = {};
				// d3 ease functions causes jank when there are a lot of slices.
				bacgroundWorker.changeEase(sliceSet.length < 50 ? "easeQuadOut" : "easeIdentitiy");
				bacgroundWorker.changeTransitionDuration(300);
				sliceSet.forEach((slice) => {
					sliceAngles[slice] = { startAngle: (Math.PI * 360) / 180, endAngle: (Math.PI * 360) / 180 };
				});
				bacgroundWorker.updateSliceAngles(sliceAngles);
				sliceAngles = {};
				sliceCount = {};
				resetSlices = true;
			};

			updateSliceSet = function () {
				if (resetSlices) {
					// d3 ease functions causes jank when there are a lot of slices.
					bacgroundWorker.changeEase(sliceSet.length < 50 ? "easeQuadIn" : "easeIdentitiy");
					sliceSet.forEach((slice) => {
						sliceAngles[slice] = { startAngle: 0, endAngle: 0 };
					});
					sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
					bacgroundWorker.updateSliceColors(sliceColors);
					bacgroundWorker.updateSliceAngles(sliceAngles);
					resetSlices = false;
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
				bacgroundWorker.changeEase("easeIdentitiy");
				bacgroundWorker.dequeue();
			};
		});
	}

	chart.data = function (value: any) {
		data = value;
		if (typeof updateData === "function") updateData();
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
