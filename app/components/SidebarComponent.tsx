"use client";
import React, { useState, useRef } from "react";
import { useHeight } from "@/app/hooks/useHeight";
import Select from "react-select";
import { useSpring, animated } from "react-spring";
import { easings } from "@react-spring/web";
import camelToFlat from "@/app/libs/cameToFlat";

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
	children: React.ReactNode;
	handleChange: (key: string) => void;
	handleReset: () => void;
}

const SidebarComponentWrapper: React.FC<SidebarComponentWrapperProps> = ({ currentKey, title, options, children, handleChange, handleReset }) => {
	const [heightOn, setHeightOn] = useState(false);
	const [sizingRef, contentHeight] = useHeight({ on: heightOn });
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

	return (
		<div key="contrainer" id={`${title}_sidebar-component`}>
			<div className="w-full flex flex-row justify-between items-baseline text-slate-50">
				<span className="text-xl font-bold tracking-widest text-[#e6c07b]">{title}</span>
				<div className="text-sm font-light cursor-pointer active:text-red-300" hidden={!currentKey.length} onClick={() => handleReset()}>
					reset
				</div>
			</div>
			<Select
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
				onChange={(e) => (e ? handleChange(e.value) : console.log(e))}
				id={`${title}_select`}
			/>
			<animated.div style={{ ...heightStyles, overflow: "hidden" }}>
				<div ref={activateRef}>{currentKey.length ? children : null}</div>
			</animated.div>
		</div>
	);
};
export default SidebarComponentWrapper;
