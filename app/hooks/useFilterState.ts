import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FilterState {
	filterKey: string;
    filterSet: { value: string; filtered: boolean }[];
	options: { value: string; label: string }[];
    setFilterKey: (filterKey: string) => void;
    setFilterSet: (filterSet: { value: string; filtered: boolean }[]) => void;
	setOptions: (options: { value: string; label: string }[]) => void;
}

export const useFilterState = create<FilterState>()(
	persist(
		(set, get) => ({
            filterKey: "",
            filterSet: [],
            options: [],
            setFilterKey: (filterKey: string) => set({ filterKey }),
            setFilterSet: (filterSet: { value: string; filtered: boolean }[]) => set({ filterSet }),
            setOptions: (options: { value: string; label: string }[]) => set({ options }),
		}),
		{
			name: "filter-store",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
