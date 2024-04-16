"use client";
import React from "react";
import Tooltip from "@/app/components/ToolTip";
import { FaRegPlayCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

interface PlayButtonProps {
	handlePlay: () => void;
	loading?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ handlePlay, loading }) => {
	return (
		<>
			{!loading && (
				<Tooltip text="Run Query" backgroundColor="slate-50" textColor="[#f4f4f4]">
					<div data-testid="play-button" onClick={handlePlay} className="relative hover:opacity-80 cursor-pointer transition">
						{!loading && <FaRegPlayCircle size={30} className="fill-[#98c379]" />}
					</div>
				</Tooltip>
			)}
			{loading && <ClipLoader size={30} color="#98c379" />}
		</>
	);
};

export default PlayButton;
