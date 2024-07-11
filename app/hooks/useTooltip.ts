"use client";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import usePortal from "./usePortal";

// Manages the tooltip state
const useTooltip = () => {
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [tooltipIsVisible, setTooltipVisable] = useState(false);
	const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 });

	const Portal = usePortal(document.getElementById("portal-root")!);

	const handleMouseEnter = useDebouncedCallback((e: React.MouseEvent) => {
		if (tooltipOpen) return;
		const bb = (e.target as HTMLElement).getBoundingClientRect();
		if (bb.width === 0 || bb.height === 0) return;
		setTooltipCoords({ x: bb.x + bb.width, y: bb.y });
		// once the tool tip is open fade it in
		setTooltipOpen(true);
		setTimeout(() => {
			setTooltipVisable(true);
		}, 10);
	}, 200);

	const handleMouseLeave = useDebouncedCallback(() => {
		setTooltipVisable(false);
		setTimeout(() => {
			setTooltipOpen(false);
		}, 200);
	}, 200);

	return { tooltipOpen, tooltipIsVisible, tooltipCoords, Portal, handleMouseEnter, handleMouseLeave };
};

export default useTooltip;
