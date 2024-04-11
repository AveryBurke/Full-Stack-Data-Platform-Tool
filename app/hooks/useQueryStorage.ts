import { create } from "zustand";

interface QueryStore {
	query: string;
	isLoading: boolean;
	onLoading: () => void;
	onFinish: () => void;
	setQuery: (query: string) => void;
}

const useQueryStore = create<QueryStore>((set) => ({
	isLoading: false,
	query: "",
	onLoading: () => set({ isLoading: true }),
	onFinish: () => set({ isLoading: false }),
	setQuery: (query: string) => set({ query }),
}));

export default useQueryStore;
