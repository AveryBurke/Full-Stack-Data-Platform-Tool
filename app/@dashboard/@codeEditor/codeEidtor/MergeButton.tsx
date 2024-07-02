"use client";
import React from "react";
import { BsSignMergeLeft } from "react-icons/bs";
import ActionButton from "@/app/components/ActionButton";
import { ClipLoader } from "react-spinners";

interface MergeButtonProps {
	hanldeClick: () => void;
	loading?: boolean;
}

const MergeButton: React.FC<MergeButtonProps> = ({ hanldeClick, loading }) => {
	return (
		<ActionButton
			handlClick={hanldeClick}
			Icon={BsSignMergeLeft}
			LoadingIcon={ClipLoader}
			color="#98c379"
			loading={loading}
			tooltip={{
				header: "Merge Query",
				body: [
					"Execute the current query and merge the current data set into the results.",
					"Primary column must be set."
				],
				alignment: { x: "right", y: "top" },
			}}
		/>
	);
};

export default MergeButton;
