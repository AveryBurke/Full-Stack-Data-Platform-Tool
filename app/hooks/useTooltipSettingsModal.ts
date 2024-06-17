import { create } from "zustand";

interface TooltipSettingsModalStore {
	isOpen?: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useTooltipSettingsModal = create<TooltipSettingsModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false })
}));

export default useTooltipSettingsModal;