"use client";
import React, { useRef, useEffect } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import useTooltip from "@/app/hooks/useTooltip";

interface PlayButtonProps {
	handlePlay: () => void;
	loading?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ handlePlay, loading }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { setCoords, setHeader, setBody, onOpen, onClose, isOpen } = useTooltip(); 
	const handleMouseEnter = (e:MouseEvent) => {
		if (!ref.current) return;
		if (isOpen) return;
		const bb = ref.current.getBoundingClientRect();
		setHeader("Run Query");
		setBody(["Execute the current query and overwire the current data set with the results"]);
		setCoords({ x: bb.x + bb.width, y: bb.y - bb.height * 2});
		onOpen();
	}

	const handleMouseLeave = () => {
		if (!isOpen) return;
		onClose();
	}

	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener("mouseenter", handleMouseEnter);
			ref.current.addEventListener("mouseleave", handleMouseLeave);
		}
		return () => {
			if (ref.current) {
				ref.current.removeEventListener("mouseenter", handleMouseEnter);
				ref.current.removeEventListener("mouseleave", handleMouseLeave);
			}
		}
	}, [ref.current, handleMouseEnter, handleMouseLeave]);

	return (
		<>
			{!loading && (
				<div
					data-testid="play-button"
					onClick={handlePlay}
					className="relative hover:opacity-80 cursor-pointer transition"
					ref={ref}
					>
					{!loading && <FaRegPlayCircle size={25} className="fill-[#98c379]" />}
				</div>
			)}
			{loading && <ClipLoader size={25} color="#98c379" />}
		</>
	);
};

export default PlayButton;
