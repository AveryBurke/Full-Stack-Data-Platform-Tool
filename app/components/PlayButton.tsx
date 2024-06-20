"use client";
import React, { useRef, useCallback } from "react";
import Tooltip from "./ToolTipComponent";
import { FaRegPlayCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import useTooltip from "../hooks/useTooltip";
import { set } from "date-fns";

interface PlayButtonProps {
	handlePlay: () => void;
	loading?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ handlePlay, loading }) => {
	console.log("PlayButton");
	// const ref = useRef(null);
	// const { setChildren, setColor, setTextColor, setText, onOpen, onClose } = useTooltip();
	// const handleMouseOver = useCallback(() => {
	// 	// setText("Run Query");
	// 	// setColor("slate-50");
	// 	// setTextColor("[#f4f4f4]");
	// 	// if (ref.current) {
	// 	// 	console.log(ref.current);
	// 	// 	setChildren(ref.current);
	// 	// 	onOpen();
	// 	// }
	// }, [ref.current]);

	// const handleMouseOut = useCallback(() => {
	// 	onClose();
	// },[]);

	return (
		<>
			{!loading && (
				<div
					// onMouseOver={handleMouseOver}
					// onMouseOut={handleMouseOut}
					// data-testid="play-button"
					// onClick={handlePlay}
					// className="relative hover:opacity-80 cursor-pointer transition"
					// ref={ref}
					>
					{!loading && <FaRegPlayCircle size={30} className="fill-[#98c379]" />}
				</div>
			)}
			{loading && <ClipLoader size={30} color="#98c379" />}
		</>
	);
};

export default PlayButton;
