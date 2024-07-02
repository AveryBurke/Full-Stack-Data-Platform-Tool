"use client";
import React, { useRef, useEffect } from "react";
import useTooltip from "@/app/hooks/useTooltip";
import { IconType } from "react-icons";
import {CircleLoader} from "react-spinners";

interface ActionButtonProps {
	handlClick: () => void;
    Icon: IconType;
    LoadingIcon: typeof CircleLoader;
    color:string;
	loading?: boolean;
    tooltip?: {
        header: string;
        body: string[];
        alignment: { x: "left" | "right", y: "top" | "bottom" }
    }
}

const ActionButton: React.FC<ActionButtonProps> = ({ handlClick, loading, Icon, LoadingIcon, color, tooltip }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { setCoords, setHeader, setBody, onOpen, onClose, setAlignment, isOpen } = useTooltip(); 
	const handleMouseEnter = (e:MouseEvent) => {
		if (!ref.current) return;
		if (isOpen) return;
        if (!tooltip) return;
		const bb = ref.current.getBoundingClientRect();
        const { header, body, alignment} = tooltip;
		setHeader(header);
		setBody(body);
		setAlignment(alignment);
		setCoords({ x:bb.x + bb.width, y: bb.y});

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
					onClick={handlClick}
					className="relative hover:opacity-80 cursor-pointer transition"
					ref={ref}
					>
					{!loading && <Icon size={25} color={color} />}
				</div>
			)}
			{loading && <LoadingIcon size={25} color={color} />}
		</>
	);
};

export default ActionButton;
