import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface QueryStore {
	query: string;
	primaryKey: string;
	isLoading: boolean;
	onLoading: () => void;
	onFinish: () => void;
	setQuery: (query: string) => void;
	data: any[];
	setData: (data: any[]) => void;
}

export const useQueryStore = create<QueryStore>()(
	persist(
		(set, get) => ({
			isLoading: false,
			primaryKey: "internalId", // default primary key is "internalId
			data: [],
			query: "",
			setData: (data: any[]) => {
				for (let i = 0; i < data.length; i++) {
					// add internalId to each data item
					data[i][get().primaryKey] = crypto.randomUUID();
				};
				set({ data })
			},
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
