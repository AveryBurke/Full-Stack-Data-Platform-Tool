import { create } from "zustand";

type AccordionStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};

const useAccordion = create<AccordionStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useAccordion;
