"use client";
import React, { useState, useRef, useEffect } from "react";
import { useHeight } from "@/app/hooks/useHeight";
import useTooltip from "@/app/hooks/useTooltip";
import Select, { components as C, DropdownIndicatorProps, SingleValue } from "react-select";
import { useSpring, animated } from "react-spring";
import { easings } from "@react-spring/web";
import camelToFlat from "@/app/libs/camelToFlat";

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

const SidebarComponentWrapper: React.FC<SidebarComponentWrapperProps> = ({ currentKey, title, options, children, handleChange, handleReset, sidebarComponentOptions }) => {
	const [heightOn, setHeightOn] = useState(false);
	const [sizingRef, contentHeight] = useHeight({ on: heightOn });
	const { setCoords, setHeader, setBody, onOpen, onClose, isOpen } = useTooltip();
	const numberOfRender = useRef(0);
	const uiReady = useRef(false);

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

	const refChevron = useRef<HTMLDivElement>(null);

	const handleMouseEnter = () => {
		if (!refChevron.current) return;
		if (isOpen) return;
		const bb = refChevron.current.getBoundingClientRect();
		
		if (sidebarComponentOptions?.tooltip) {
			const { tooltip } = sidebarComponentOptions;
			setHeader(tooltip.header);
			setBody(tooltip.body || []);
		} else {
			setHeader(title);
			setBody([]);
		}
		setCoords({ x: bb.x + bb.width, y: bb.y });
		onOpen();
	};

	const handleMouseLeave = () => {
		if (!isOpen) return;
		onClose();
	};

	useEffect(() => {
		numberOfRender.current++;
		if (refChevron.current && numberOfRender.current >= 2) {
			refChevron.current.addEventListener("mouseenter", handleMouseEnter);
			refChevron.current.addEventListener("mouseleave", handleMouseLeave);
		}
		return () => {
			if (refChevron.current) {
				refChevron.current.removeEventListener("mouseenter", handleMouseEnter);
				refChevron.current.removeEventListener("mouseleave", handleMouseLeave);
			}
		};
	}, [refChevron.current, handleMouseEnter, handleMouseLeave]);

	// override the default dropdown indicator
	// in order to add a ref and listeners for mouse enter and mouse leave, for the toolthip
	const DropdownIndicator = (props: DropdownIndicatorProps) => {
		return (
			<div id={title + "-indicator-wrapper"} key={title + "-wrapper"} ref={refChevron}>
				<C.DropdownIndicator {...props}>
					<svg
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
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</C.DropdownIndicator>
			</div>
		);
	};

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
			<animated.div style={{ ...heightStyles, overflow: "hidden" }}>
				<div ref={activateRef}>{currentKey.length ? children : null}</div>
			</animated.div>
		</div>
	);
};
export default SidebarComponentWrapper;
