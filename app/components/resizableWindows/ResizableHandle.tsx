"use client";
import React from "react";

interface ResizableHandleProps {
	isResizing: boolean;
	isVertical?: boolean | null;
	handleMouseDown: (e:React.MouseEvent) => void;
    direction: "left" | "right" | "top" | "bottom";
	collapsed?: boolean;
	rect?: DOMRect | null;
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({ isResizing, isVertical, handleMouseDown, direction, collapsed, rect }) => {
	let cursor:string = "";
	if (collapsed) {
		switch (direction) {
			case "left":
				cursor = "cursor-e-resize";
				break;
			case "right":
				cursor = isVertical ? "cursor-s-resize" : "cursor-e-resize";
				break;
			case "top":
				cursor = "cursor-s-resize";
				break;
			case "bottom":
				cursor = "cursor-w-resize";
				break;
			default:
				const _exhaustiveCheck: never = direction;
				throw new Error(`Unhandled direction: ${_exhaustiveCheck}`);
		}
	}
	const style = isVertical ? {top:rect?.bottom || 0, left:rect?.x || 0, width:rect?.width || 0} : {top:rect?.y || 0, left:rect?.[direction] || 0, height:rect?.height || 0};
	if (!collapsed) isVertical ? cursor = "cursor-row-resize" : cursor = "cursor-col-resize"
	const positionHandleStyle = isVertical ? `h-1 -translate-y-px ${cursor}` : `w-1 -translate-x-px ${cursor}`;
	return <div style={style} className={`absolute z-50 ${positionHandleStyle} hover:bg-[#abb2bf] hover:bg-opacity-60 ${isResizing ? "bg-[#abb2bf] bg-opacity-60" : ""}`} onMouseDown={(e) => handleMouseDown(e)} />;
};

export default ResizableHandle;