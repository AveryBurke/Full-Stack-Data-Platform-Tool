// Mock for the useFilterState hook
// This mock is used to test the behavior of the useFilterState hook, without having to rely on the actual state
// This mock is used in the useChartUpdates test file
// jest will also mock zustand's create function
import { create } from "zustand";

export interface FilterState {
	filterKey: string;
	filterSet: { value: string; filtered: boolean }[];
	options: { value: string; label: string }[];
	setFilterKey: (filterKey: string) => void;
	setFilterSet: (filterSet: { value: string; filtered: boolean }[]) => void;
	setOptions: (options: { value: string; label: string }[]) => void;
}

export const useFilterStateMock = create<FilterState>()((set, get) => ({
	filterKey: "",
	filterSet: [],
	options: [],
	setFilterKey: (filterKey: string) => set({ filterKey }),
	setFilterSet: (filterSet: { value: string; filtered: boolean }[]) => set({ filterSet }),
	setOptions: (options: { value: string; label: string }[]) => set({ options }),
}));
