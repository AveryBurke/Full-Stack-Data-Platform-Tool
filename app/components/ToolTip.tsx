"use client";
import React from "react";

interface TooltipProps {
	coords: { x: number; y: number };
	alignment: { x: string; y: string };
	children: React.ReactNode;
}

const TooltipComponent: React.FC<TooltipProps> = ({ children, alignment, coords: { x, y }, }) => {
	let placementStyles = "transform";
	switch (alignment?.x) {
		case "center":
			placementStyles += " translate-x-1/2";
			break;
		case "right":
			placementStyles += "";
			break;
		default:
			placementStyles += "";
	}
	switch (alignment?.y) {
		case "center":
			placementStyles += " -translate-y-1/2";
			break;
		case "top":
			placementStyles += " -translate-y-full";
			break;
		case "bottom":
			placementStyles += "";
			break;
		default:
			placementStyles += "";
	}

	return (
		<div
			className={`absolute p-2 bg-slate-50 text-slate-800 border border-gray-300 rounded-md shadow-md flex flex-col z-50` + placementStyles}
			style={{ top: y, left: x}}>
			{children}
		</div>
	);
};

export default TooltipComponent;
