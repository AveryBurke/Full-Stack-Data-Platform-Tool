"use client";
import React, { useState, useRef } from "react";
import { useHeight } from "@/app/hooks/useHeight";
import ToolTip from "@/app/components/ToolTip";
import usePortal from "../hooks/usePortal";
import Select, { components as C, DropdownIndicatorProps, SingleValue } from "react-select";
import { useSpring, animated } from "react-spring";
import { easings } from "@react-spring/web";
import camelToFlat from "@/app/libs/camelToFlat";
import { useDebouncedCallback } from "use-debounce";

/**
 * create a sidebar component that manages one slice of state
 * used to generate sidebar parameter components {@link ./SidebarParameterComponent} and used to create sidebar filter component {@link ./SidebarFilterComponent}
 * @param param0 props for creating a sidebar component
 * @returns {JSX.Element} a sidebar component
 */

interface SidebarComponentWrapperProps {
	currentKey: string;
	title: string;
	options: { value: string; label: string }[];
	children?: React.ReactNode;
	sidebarComponentOptions?: SidebarComponentOptions;
	handleChange: (key: string) => void;
	handleReset: () => void;
}

const SidebarComponentWrapper: React.FC<SidebarComponentWrapperProps> = ({
	currentKey,
	title,
	options,
	children,
	handleChange,
	handleReset,
	sidebarComponentOptions,
}) => {
	const [heightOn, setHeightOn] = useState(false);
	const [sizingRef, contentHeight] = useHeight({ on: heightOn });
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [tooltipIsVisible, setTooltipIsVisible] = useState(false);
	const [tooltipCoords, setCoords] = useState({ x: 0, y: 0 });
	const uiReady = useRef(false);

	const Portal = usePortal(document.getElementById("portal-root")!);

	// wait until the compnent has rendered to pass a ref
	const activateRef = (ref: HTMLDivElement | null) => {
		sizingRef.current = ref;
		if (!heightOn) {
			setHeightOn(true);
		}
	};

	const heightStyles = useSpring({
		immediate: !uiReady.current,
		config: {
			duration: 200,
			easing: easings.easeInOutQuad,
		},
		from: { height: 20 }, //<--the collapsed div is 20px. To do: make this programtic, or save the current size in state
		to: { height: contentHeight },
		onRest: () => (uiReady.current = true),
	});

	const handleMouseEnter = useDebouncedCallback((e: React.MouseEvent) => {
		if (tooltipOpen) return;
		const bb = (e.target as HTMLElement).getBoundingClientRect();
		if (bb.width === 0 || bb.height === 0) return;
		setCoords({ x: bb.x + bb.width, y: bb.y });
		// once the tool tip is open fade it in
		setTooltipOpen(true);
		setTimeout(() => {
			setTooltipIsVisible(true);
		}, 10);
	}, 250);

	const handleMouseLeave = useDebouncedCallback((e: React.MouseEvent) => {
		// fade out the tool tip, then close it
		setTooltipIsVisible(false);
		setTimeout(() => {
			setTooltipOpen(false);
		}, 200);
	}, 250);

	// override the default dropdown indicator
	// in order to warp the svg in a div to handle mouse events
	const DropdownIndicator = (props: DropdownIndicatorProps) => {
		return (
			<div id={title + "_drop_down_indicator"} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
				<C.DropdownIndicator {...props}>
					<svg
						pointerEvents={"none"}
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-chevron-down">
						<polyline pointerEvents={"none"} points="6 9 12 15 18 9"></polyline>
					</svg>
				</C.DropdownIndicator>
			</div>
		);
	};

	// wrap the tooltip in a div to controle visibility
	const TT = (
		<div className={"transition-opacity duration-200 " + (tooltipIsVisible ? "opacity-100" : "opacity-0")}>
			<ToolTip coords={tooltipCoords} alignment={sidebarComponentOptions?.tooltip?.alignment || { x: "right", y: "center" }}>
				{sidebarComponentOptions?.tooltip?.header && <h3 className="font-bold text-center">{sidebarComponentOptions.tooltip.header}</h3>}
				{sidebarComponentOptions?.tooltip?.body?.length! > 0 && <hr className="my-2" />}
				{sidebarComponentOptions?.tooltip?.body?.map((line, index) => (
					<span key={index} className="text-sm text-slate-600">
						{line}
					</span>
				))}
			</ToolTip>
		</div>
	);

	const components = {
		DropdownIndicator,
	};

	return (
		<div key="contrainer" id={`${title}_sidebar-component`}>
			<div className="w-full flex flex-row justify-between items-baseline text-slate-50">
				<span className="font-bold tracking-wide text-[#e6c07b]">{title}</span>
				<div className="text-xs font-light cursor-pointer active:text-red-300" hidden={!currentKey.length} onClick={() => handleReset()}>
					reset
				</div>
			</div>
			<Select
				//@ts-ignore
				components={components}
				styles={{
					container: (baseStyles, state) => ({
						...baseStyles,
						width: "100%",
						marginBottom: ".5rem",
						borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
					}),
					menu: (base, state) => ({
						...base,
						// override border radius to match the box
						borderRadius: "0 0 3px 3px",
						// beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
						hyphens: "auto",
						marginTop: 5,
						textAlign: "left",
						// prevent menu to scroll y
						wordWrap: "break-word",
						fontSize: "inherit",
						position: "absolute",
						zIndex: 999,
					}),
					menuList: (base) => ({
						...base,
						fontSize: "inherit",
					}),
				}}
				theme={(theme) => ({
					...theme,
					colors: {
						...theme.colors,
						primary: "#f7bb87",
					},
				})}
				placeholder={`${title} column`}
				options={options}
				value={
					currentKey.length === 0
						? null
						: {
								value: currentKey,
								label: camelToFlat(currentKey).replace("_", " "),
						  }
				}
				onChange={(e) => (e ? handleChange((e as SingleValue<{ value: string; label: string }>)!.value) : console.log(e))}
				id={`${title}_select`}
			/>
			{tooltipOpen && <Portal>{TT}</Portal>}
			<animated.div style={{ ...heightStyles, overflow: "hidden" }}>
				<div ref={activateRef}>{currentKey.length ? children : null}</div>
			</animated.div>
		</div>
	);
};
export default SidebarComponentWrapper;
