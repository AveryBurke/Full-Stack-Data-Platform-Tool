"use client";
import React, { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Tooltip from "./ToolTip";
import usePortal from "../hooks/usePortal";
import { IconType } from "react-icons";
import { CircleLoader } from "react-spinners";

interface ActionButtonProps {
	handlClick: () => void;
	Icon: IconType;
	LoadingIcon: typeof CircleLoader;
	color: string;
	loading?: boolean;
	tooltip?: {
		header: string;
		body: string[];
		alignment: { x: "left" | "right"; y: "top" | "bottom" };
	};
}

const ActionButton: React.FC<ActionButtonProps> = ({ handlClick, loading, Icon, LoadingIcon, color, tooltip }) => {
	const ref = useRef<HTMLDivElement>(null);

	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [tooltipIsVisible, setTooltipVisable] = useState(false);
	const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 });

	const Portal = usePortal(document.getElementById("portal-root")!);

	const TT = (
		<div className={"transition-opacity duration-200 " + (tooltipIsVisible ? "opacity-100" : "opacity-0")}>
			<Tooltip coords={tooltipCoords} alignment={tooltip?.alignment || { x: "right", y: "center" }}>
				{tooltip?.header && <h3 className="font-bold text-center">{tooltip.header}</h3>}
				{tooltip?.body?.length! > 0 && <hr className="my-2" />}
				{tooltip?.body?.map((line, index) => (
					<span key={index} className="text-sm text-slate-600">
						{line}
					</span>
				))}
			</Tooltip>
		</div>
	);

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

	return (
		<>
			{tooltipOpen &&  <Portal>{TT}</Portal>}
			{!loading && (
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					data-testid="play-button"
					onClick={handlClick}
					className="relative hover:opacity-80 cursor-pointer transition"
					ref={ref}>
					{!loading && <Icon size={25} color={color} />}
				</div>
			)}
			{loading && <LoadingIcon size={25} color={color} />}
		</>
	);
};

export default ActionButton;
