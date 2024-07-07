"use client";
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import ResizableHandle from "./ResizableHandle";
import { set } from "date-fns";

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
	collapseWidth?: number;
	collapseHeight?: number;
}

/**
 * A resizable pane component component.
 * The resize hanlde is rendered, as a portal, in the body of the document to avoid issues with z-index.
 */
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
	collapseHeight,
	collapseWidth,
}) => {
	const [size, setSize] = useState(initialSize);
	const [antiDimensionSz, setAntiDimensionSz] = useState<"auto" | 0>("auto");
	const [collapsed, setCollapsed] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [renderChildren, setRenderChildren] = useState(true);
	const [rect, setRect] = useState<DOMRect | null>(null);

	const ref = useRef<HTMLDivElement>(null);

	const dimension = isVertical ? "height" : "width";
	const antiDimension = isVertical ? "width" : "height";


	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			if (!isResizing || !maxSize) return;

			const movement = isVertical ? e.movementY : e.movementX;
			let newSize = growDirection !== "left" ? size + movement : size - movement;

			newSize = Math.max(minSize, Math.min(maxSize, newSize));
			setSize(newSize);
			setAntiDimensionSz("auto");
			setRenderChildren(true);
		};

		const handleMouseUp = (e: MouseEvent) => {
			e.preventDefault();

			if (isVertical && collapseHeight && size < collapseHeight) setSize(0);
			if (!isVertical && collapseWidth && size < collapseWidth) setSize(0);

			if (isVertical && collapseWidth && rect && rect.width < collapseWidth) setAntiDimensionSz(0);
			if (!isVertical && collapseHeight && rect && rect.height < collapseHeight) setAntiDimensionSz(0);

			setIsResizing(false);
			setRenderChildren(!collapsed);

		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [size, isResizing, minSize, maxSize, isVertical, rect, collapseHeight, collapseWidth, growDirection]);

	// ResizeObserver is used to update the hanlde poisition width and height of the resizable pane
	// these need to be passed as props, because the hanlde is rendered as a portal
	useLayoutEffect(() => {
		const observeTarget = ref.current;
		if (!observeTarget) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const clientRect = entry.target.getBoundingClientRect();
				setCollapsed(clientRect.height < collapseHeight! || clientRect.width < collapseWidth!);
				setRect(clientRect);
			}
		});

		resizeObserver.observe(observeTarget);

		return () => {
			resizeObserver.unobserve(observeTarget);
		};
	}, []);


	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	};

	const clName = `@container relative ${bgColor} ${grow ? "grow" : ""} shrink-0 ${renderChildren ? "" : "transition-all duration-75"} ` + additionalStyles;

	return (
		<div ref={ref} className={clName} style={{ [dimension]: `${size}px`, [antiDimension]: antiDimensionSz }}>
			{!grow &&
				createPortal(
					<ResizableHandle
						isResizing={isResizing}
						isVertical={isVertical}
						handleMouseDown={(e: React.MouseEvent) => handleMouseDown(e)}
						direction={growDirection || "right"}
						collapsed={collapsed}
						rect={rect}
					/>,
					document.body
				)}
			{renderChildren && children}
		</div>
	);
};

export default ResizablePane;
