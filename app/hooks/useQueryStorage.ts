import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface QueryStore {
	query: string;
	isLoading: boolean;
	onLoading: () => void;
	onFinish: () => void;
	setQuery: (query: string) => void;
}

export const useQueryStore = create<QueryStore>()(
	persist(
		(set, get) => ({
			isLoading: false,
			query: "",
			onLoading: () => set({ isLoading: true }),
			onFinish: () => set({ isLoading: false }),
			setQuery: (query: string) => set({ query }),
		}),
		{
			name: "query-store",
			storage: createJSONStorage(() => localStorage), 
		}
	)
);
