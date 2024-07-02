"use client";
import React from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import ActionButton from "@/app/components/ActionButton";
import { ClipLoader } from "react-spinners";


interface PlayButtonProps {
	handlePlay: () => void;
	loading?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({handlePlay, loading}) => {

	return (<ActionButton handlClick={handlePlay} Icon={FaRegPlayCircle} LoadingIcon={ClipLoader} color="#98c379" loading={loading} tooltip={{ header: "Run Query", body: ["Execute the current query and overwire the current data set with the results"], alignment: { x: "right", y: "top" } }} />);
};

export default PlayButton;
