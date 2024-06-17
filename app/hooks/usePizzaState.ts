import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PizzaState {
	ringKey: string;
	ringSet: string[];
	ringCounts: { [key: string]: { current: number; prev: number } };
	sliceKey: string;
	sliceSet: string[];
	tooltip: string[];
	sliceCounts: { [key: string]: { current: number; prev: number } };
	options: { value: string; label: string }[];
	setRingKey: (ringKey: string) => void;
	setRingSet: (ringSet: string[]) => void;
	setRingCounts: (ringCounts: { [key: string]: number }) => void;
	setSliceKey: (sliceKey: string) => void;
	setSliceSet: (sliceSet: string[]) => void;
	setSliceCounts: (sliceCounts: { [key: string]: number }) => void;
	setOptions: (options: { value: string; label: string }[]) => void;
	setTooltip: (tooltip: string[]) => void;
}

export const usePizzaState = create<PizzaState>()(
	persist(
		(set, get) => ({
			ringKey: "",
			ringSet: [],
			ringCounts: {},
			sliceKey: "",
			sliceSet: [],
			sliceCounts: {},
			tooltip: [],
			options: [],
			setRingKey: (ringKey: string) => set({ ringKey }),
			setRingSet: (ringSet: string[]) => set({ ringSet }),
			setRingCounts: (ringCounts: { [key: string]: number }) => {
				const prevRingCounts = get().ringCounts;
				const ringSet = get().ringSet;
				const newRingCounts = Object.fromEntries(ringSet.map((ring) => [ring, { current: ringCounts[ring], prev: prevRingCounts[ring] ? prevRingCounts[ring].current : 0 }]));
				set({ ringCounts: newRingCounts });
			},
			setSliceKey: (sliceKey: string) => set({ sliceKey }),
			setSliceSet: (sliceSet: string[]) => set({ sliceSet }),
			setSliceCounts: (sliceCounts: { [key: string]: number }) => {
				const prevSliceCounts = get().sliceCounts;
				const sliceSet = get().sliceSet;
				const newSliceCounts = Object.fromEntries(sliceSet.map((slice) => [slice, { current: sliceCounts[slice], prev: prevSliceCounts[slice] ? prevSliceCounts[slice].current : 0 }]));
				set({ sliceCounts: newSliceCounts });
			},
			setOptions: (options: { value: string; label: string }[]) => set({ options }),
			setTooltip: (tooltip: string[]) => set({ tooltip }),
			getTooltip: () => get().tooltip,
		}),
		{
			name: "pizza-store",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
