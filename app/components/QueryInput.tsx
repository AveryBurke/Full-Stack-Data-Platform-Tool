"use client";
import React, { useRef, useState, memo } from "react";
import { queryAgent } from "@/app/actions/runQueryAgent";
import { suggestionAgent } from "../actions/runSuggestionAgent";
import TextareaForm from "./inputs/TextareaForm";
import SheetClient from "./SheetClient";
import Sheet from "./Sheet"
// import { rawQuery } from "../actions/rawQuery";
// import executeQuery from "@/app/actions/runAgent";
// import Table from "@/app/components/Table";
// import GridLoader from "react-spinners/GridLoader";
// import DeveloperFeedbackButton from "./DeveloperFeedbackButton";

const TextInput: React.FC = () => {
	const [query, setQuery] = useState("");
	const [previousSuggestion, setPreviousSuggestion] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const hanldeSuggestionRequest = async (value: string) => {
		try {
			const message = await suggestionAgent(previousSuggestion);
			if (message.type === "success") {
				inputRef.current!.value = message.message;
				setPreviousSuggestion(message.message);
			}
		} catch (error) {
			console.error("Error getting suggestion:", error);
		}
	};
	const handleSubmit = async (value: string) => {
		setLoading(true);
		try {
			const message = await queryAgent(value);
			if (message.type === "success") {
				setQuery(message.message);
			} else {
				setQuery("");
			}
		} catch (error) {
			console.error("Error executing query:", error);
		}
		setLoading(false);
	};

	// const MemoSheetClient = memo( async function MemoSheetClient({ query }: { query: string }) {
	// 	return <SheetClient query={query} />;
	// });

	return (
		<div>
			<TextareaForm
				handleSubmit={handleSubmit}
				handleSecondaryAction={hanldeSuggestionRequest}
				loading={loading}
				title="Fetch data"
				placeholder="Enter your request here."
				sunmitButtonLabel="Fetch"
				secondaryButtonLabel="Suggest"
			/>
			<SheetClient query={query} />
			{/* <SheetClient query={query} /> */}
			{/* <MemoSheetClient query={query} />
			 */}
			{/* {loading ? (
				<GridLoader loading={loading} />
			) : queryResult ? (
				<Table data={queryResult} />
			) : null} */}
			{/* <DeveloperFeedbackButton /> */}
		</div>
	);
};

export default TextInput;
