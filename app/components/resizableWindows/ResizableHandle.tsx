"use client";
import React from "react";

interface ResizableHandleProps {
	isResizing: boolean;
	isVertical?: boolean | null;
	handleMouseDown: (e: React.MouseEvent) => void;
	cursor: Cursor;
	direction: "left" | "right" | "top" | "bottom";
	rect?: DOMRect | null;
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({ isResizing, isVertical, handleMouseDown, rect, cursor, direction }) => {
	const style = isVertical
		? { top: rect?.bottom || 0, left: rect?.x || 0, width: rect?.width || 0 }
		: { top: rect?.y || 0, left: rect?.[direction] || 0, height: rect?.height || 0 };
	const positionHandleStyle = isVertical ? `h-1 -translate-y-px ${cursor}` : `w-1 -translate-x-px ${cursor}`;
	return (
		<div
			style={style}
			className={`absolute z-50 ${positionHandleStyle} hover:bg-[#abb2bf] hover:bg-opacity-60 ${isResizing ? "bg-[#abb2bf] bg-opacity-60" : ""}`}
			onMouseDown={(e) => handleMouseDown(e)}
		/>
	);
};

export default ResizableHandle;
