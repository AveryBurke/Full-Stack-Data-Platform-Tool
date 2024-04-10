import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useQueryStore = create(
	persist(
		(set, get) => ({
			query: "",
			overWriteQuery: (q: string) => set({ query: q }),
		}),
		{
			name: "query-storage",
			storage: createJSONStorage(() => localStorage), // Use local storage
		}
	)
);
