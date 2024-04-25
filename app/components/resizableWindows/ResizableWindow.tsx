"use client";
import React, { useState, useEffect } from "react";
import ResizableHandle from "./ResizableHandle";

interface ResizablePaneProps {
	minSize: number;
	initialSize: number;
	maxSize?: number; // maxSize is only needed if grow is false
	grow?: boolean | null;
	vertical?: boolean | null;
	bgColor: string;
	growDirection?: "left" | "right" | "top" | "bottom";
	children?: React.ReactNode;
	additionalStyles?: string;
}

const ResizablePane: React.FC<ResizablePaneProps> = ({
	minSize,
	initialSize,
	maxSize,
	grow,
	vertical: isVertical,
	bgColor,
	growDirection,
	children,
	additionalStyles,
}) => {
	const [size, setSize] = useState(initialSize);
	const [isResizing, setIsResizing] = useState(false);

	const dimension = isVertical ? "height" : "width";

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			if (!isResizing || !maxSize) return;

			const movement = isVertical ? e.movementY : e.movementX;
			let newSize = growDirection !== "left" ? size + movement : size - movement;

			newSize = Math.max(minSize, Math.min(maxSize, newSize));
			setSize(newSize);
		};

		const handleMouseUp = (e:MouseEvent) => {
			e.preventDefault();
			setIsResizing(false);}

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [size, isResizing, minSize, maxSize, isVertical]);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	};
	return (
		<div className={`@container relative ${bgColor} ${grow ? "grow" : ""} shrink-0 ` + additionalStyles} style={{ [dimension]: `${size}px` }}>
			{!grow && (
				<ResizableHandle
					isResizing={isResizing}
					isVertical={isVertical}
					handleMouseDown={(e: React.MouseEvent) => handleMouseDown(e)}
					direction={growDirection || "right"}
				/>
			)}
			{children}
		</div>
	);
};

export default ResizablePane;
