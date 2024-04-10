"use client";
import React from "react";

interface ResizableHandleProps {
	isResizing: boolean;
	isVertical?: boolean | null;
	handleMouseDown: () => void;
    direction: "left" | "right" | "top" | "bottom";
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({ isResizing, isVertical, handleMouseDown, direction }) => {
	const positionHandleStyle = isVertical ? `h-1 left-0 right-0 bottom-0 cursor-row-resize` : `w-1 top-0 bottom-0 ${direction}-0 cursor-col-resize`;

	return <div className={`absolute ${positionHandleStyle} hover:bg-blue-600 ${isResizing ? "bg-blue-600" : ""}`} onMouseDown={handleMouseDown} />;
};

export default ResizableHandle;
