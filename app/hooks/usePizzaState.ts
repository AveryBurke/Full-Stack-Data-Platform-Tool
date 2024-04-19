import { sleep } from "openai/core.mjs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PizzaState {
	ringKey: string;
	ringSet: string[];
	sliceKey: string;
	sliceSet: string[];
	options: { value: string; label: string }[];
	setRingKey: (ringKey: string) => void;
	setRingSet: (ringSet: string[]) => void;
	setSliceKey: (sliceKey: string) => void;
	setSliceSet: (sliceSet: string[]) => void;
	setOptions: (options: { value: string; label: string }[]) => void;
}

export const usePizzaState = create<PizzaState>()(
	persist(
		(set, get) => ({
			ringKey: "",
			ringSet: [],
			sliceKey: "",
			sliceSet: [],
			options: [],
			setRingKey: (ringKey: string) => set({ ringKey }),
			setRingSet: (ringSet: string[]) => set({ ringSet }),
			setSliceKey: (sliceKey: string) => set({ sliceKey }),
			setSliceSet: (sliceSet: string[]) => set({ sliceSet }),
			setOptions: (options: { value: string; label: string }[]) => set({ options }),
		}),
		{
			name: "pizza-store",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
