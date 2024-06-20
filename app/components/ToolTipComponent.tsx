"use client";
import React from "react";
import useTooltip from "../hooks/useTooltip";

const TooltipComponent: React.FC = () => {
	const { coords:{x,y}, text, backgroundColor, textColor, isOpen } = useTooltip();
	return (
		<span
			style={{top: `${y - 30}px`, left: `${x}px`, zIndex: 100}}
			className={` max-w-[400px] text-pretty text-sm rounded-sm pointer-events-none absolute -translate-x-1/2 shadow-sm bg-${
				backgroundColor || "neutral-800"
			} px-2 py-1 text-${textColor || "white"} opacity-${
				isOpen ? "100" : "0"
			} before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:content-[''] transition-opacity duration-300`}>
			{text}
		</span>
	);
};

export default TooltipComponent;
