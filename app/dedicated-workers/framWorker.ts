import * as Comlink from "comlink";

class FrameWorker {
	pallet: { [slice: string]: string[] } = {};
	ringHeights: { [key: string]: { innerRadius: number; outerRadius: number } } = {};
	sliceAngles: { [key: string]: { startAngle: number; endAngle: number } } = {};
	sliceColors: { [key: string]: string } = {};
	arcs: Section[] = [];
	frame: Section[][] = [];
	constructor(
		sliceAngles: { [key: string]: { startAngle: number; endAngle: number } },
		ringHeights: { [key: string]: { innerRadius: number; outerRadius: number } },
		sliceColors: { [key: string]: string }
	) {
		this.sliceAngles = sliceAngles;
		this.ringHeights = ringHeights;
		this.sliceColors = sliceColors;
		this.updateArcs();
		this.frame.push(this.arcs);
	}

	updateSliceAngles = (sliceAngles: { [slice: string]: { startAngle: number; endAngle: number } }) => {
		this.sliceAngles = sliceAngles;
		this.updateArcs();
		this.frame.push(this.arcs);
	};

	updateRingHeights = (ringHeights: { [ring: string]: { innerRadius: number; outerRadius: number } }) => {
		this.ringHeights = ringHeights;
		this.updateArcs();
		this.frame.push(this.arcs);
	};

	updateSliceColors = (sliceColors: { [slice: string]: string }) => {
		this.sliceColors = sliceColors;
	};

	getFrames = (cb: (frames: Section[][]) => void) => {
		cb(this.frame);
		this.frame = [];
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
						slice,
						ring,
						fill: pallet[j % pallet.length],
					};
				});
			})
			.flat();
	}
}
export { FrameWorker };
Comlink.expose(FrameWorker);
