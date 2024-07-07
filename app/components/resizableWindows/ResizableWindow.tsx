"use client";
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, use } from "react";
import { createPortal } from "react-dom";
import ResizableHandle from "./ResizableHandle";
import { set } from "date-fns";
import exp from "constants";

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
	collapseThreshold?: number;
	expansionThreshold?: number;
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
	collapseThreshold = -Infinity,
	expansionThreshold = Infinity,
}) => {
	const [size, setSize] = useState(initialSize);
	const [collapsed, setCollapsed] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [rect, setRect] = useState<DOMRect | null>(null);
	const [cursor, setCursor] = useState<Cursor>("cursor-col-resize");

	const ref = useRef<HTMLDivElement>(null);

	const dimension = isVertical ? "height" : "width";

	useEffect(() => {
		if (isVertical) setCursor("cursor-row-resize");
	}, []);

	useEffect(() => {
		console.log(cursor);
	}, [cursor]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			if (!isResizing || !maxSize) return;

			const movement = isVertical ? e.movementY : e.movementX;
			let newSize = growDirection !== "left" ? size + movement : size - movement;

			newSize = Math.max(minSize, Math.min(maxSize, newSize));
			setSize(newSize);
			setCollapsed(false);

			// cursor logic
			if (isVertical) {
				if (newSize < expansionThreshold || newSize > collapseThreshold) setCursor("cursor-row-resize");
				if (newSize < collapseThreshold) setCursor("cursor-s-resize");
				if (newSize > expansionThreshold) setCursor("cursor-n-resize");
			} else {
				if (newSize < expansionThreshold || newSize > collapseThreshold) setCursor("cursor-col-resize");
				if (newSize < collapseThreshold && growDirection === "left") setCursor("cursor-w-resize");
				if (newSize > expansionThreshold && growDirection === "left") setCursor("cursor-e-resize");
				if (newSize < collapseThreshold && growDirection === "right") setCursor("cursor-e-resize");
				if (newSize > expansionThreshold && growDirection === "right") setCursor("cursor-w-resize");
			}

			// vertical cursor logic

			// fullSize === true triggers the pane to expand to the full size using the 100% css value
			// this means we don't have the current size in pixels, so we need to set state to the current size
			// before the drag event or else the pane will jump to the pre-expanded size
			if (isVertical) {
				if (expanded && rect) {
					setExpanded(false);
					setSize(rect.height);
				}
			} else if (expanded && rect) {
				setExpanded(false);
				setSize(rect.width);
			}
		};

		const handleMouseUp = (e: MouseEvent) => {
			e.preventDefault();
			

			if (size < expansionThreshold || size > collapseThreshold) {
				setExpanded(false);
				setCollapsed(false);
			}
			if (size < collapseThreshold) {
				setSize(0);
				setCollapsed(true);
			}
			if (size > expansionThreshold) {
				setExpanded(true);
			}

			setIsResizing(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [size, isResizing, minSize, maxSize, isVertical, rect, collapseThreshold, expansionThreshold, growDirection]);

	// ResizeObserver is used to update the hanlde poisition width and height of the resizable pane
	// these need to be passed as props, because the hanlde is rendered as a portal
	useLayoutEffect(() => {
		const observeTarget = ref.current;
		if (!observeTarget) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const clientRect = entry.target.getBoundingClientRect();
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

	const clName =
		`@container 
				relative 
				${bgColor} 
				${grow ? "grow" : ""} 
				shrink-0 
				${collapsed || expanded ? " transition-all duration-75 " : ""} 
				` + additionalStyles;

	return (
		<div draggable={true} ref={ref} className={clName} style={{ [dimension]: expanded ? "calc(100% - 3px)" : `${size}px` }}>
			{!grow &&
				createPortal(
					<ResizableHandle
						isResizing={isResizing}
						isVertical={isVertical}
						handleMouseDown={(e: React.MouseEvent) => handleMouseDown(e)}
						direction={growDirection || "right"}
						cursor={cursor}
						rect={rect}
					/>,
					document.body
				)}
			{!collapsed && rect && (isVertical ? rect.width > 30 : rect.height > 30) && children}
		</div>
	);
};

export default ResizablePane;
