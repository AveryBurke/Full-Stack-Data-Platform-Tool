"use client";
import { create } from "zustand";

interface TooltipSettingsModalStore {
	coords: { x: number; y: number };
	header: string;
	body: string[];
	isOpen?: boolean;
	alignment?: { x: "center" | "left" | "right"; y: "center" | "top" | "bottom" };
	setCoords: (coords: { x: number; y: number }) => void;
	setHeader: (header: string) => void;
	setBody: (body: string[]) => void;
	setAlignment: (alignment: { x: "center" | "left" | "right"; y: "center" | "top" | "bottom" }) => void;
	onOpen: () => void;
	onClose: () => void;
}

const useTooltip = create<TooltipSettingsModalStore>((set) => ({
	coords: { x: 0, y: 0 },
	alignment: { x: "center", y: "center" },
	header: "",
	body: [],
	isOpen: false,
	setCoords: (coords: { x: number; y: number }) => set({ coords }),
	setHeader: (header: string) => set({ header }),
	setBody: (body: string[]) => set({ body }),
	setAlignment: (alignment: { x: "center" | "left" | "right"; y: "center" | "top" | "bottom" }) => set({ alignment }),
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useTooltip;
