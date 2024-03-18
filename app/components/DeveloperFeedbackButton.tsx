"use client";
import saveExampleToDisk from "../actions/saveExampleToDisk";
import Button from "./Button";
import React, { useState } from "react";

interface DeveloperFeedbackButtonProps {
	prompt: string;
	query: string;
}

const DeveloperFeedbackButton: React.FC<DeveloperFeedbackButtonProps> = ({ prompt, query }) => {
	const [disabled, setDisabled] = useState(false);
	const handleClick = async () => {
		setDisabled(true);
		await saveExampleToDisk(prompt, query);
        setDisabled(false);''
	};
	return (
		<div className="w-full sm:w-auto">
			<Button {...{ onClick: handleClick, label: "save feedback", disabled }} />
		</div>
	);
};

export default DeveloperFeedbackButton;
