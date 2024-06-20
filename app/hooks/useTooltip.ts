"use client";
import { create } from "zustand";

interface TooltipSettingsModalStore {
	coords: { x: number; y: number };
	text: string;
	backgroundColor?: string;
	textColor?: string;
	isOpen?: boolean;
	setCoords: (coords: { x: number; y: number }) => void;
	setColor: (color: string) => void;
	setTextColor: (color: string) => void;
	setText: (text: string) => void;
	onOpen: () => void;
	onClose: () => void;
}

const useTooltip = create<TooltipSettingsModalStore>((set) => ({
	coords: { x: 0, y: 0 },
	text: "",
	backgroundColor: "",
	textColor: "",
	isOpen: false,
	setColor: (color: string) => set({ backgroundColor: color }),
	setTextColor: (color: string) => set({ textColor: color }),
	setCoords: (coords: { x: number; y: number }) => set({ coords }),
	setText: (text: string) => set({ text }),
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useTooltip;
