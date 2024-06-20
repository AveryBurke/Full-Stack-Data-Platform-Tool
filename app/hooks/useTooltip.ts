"use client";
import { create } from "zustand";

interface TooltipSettingsModalStore {
	coords: { x: number; y: number };
	header: string;
	body: string[];
	isOpen?: boolean;
	setCoords: (coords: { x: number; y: number }) => void;
	setHeader: (header: string) => void;
	setBody: (body: string[]) => void;
	onOpen: () => void;
	onClose: () => void;
}

const useTooltip = create<TooltipSettingsModalStore>((set) => ({
	coords: { x: 0, y: 0 },
	header: "",
	body: [],
	isOpen: false,
	setCoords: (coords: { x: number; y: number }) => set({ coords }),
	setHeader: (header: string) => set({ header }),
	setBody: (body: string[]) => set({ body }),
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useTooltip;
