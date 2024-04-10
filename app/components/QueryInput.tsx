"use client";
import React, { useRef, useState, memo } from "react";
import { queryAgent } from "@/app/actions/runQueryAgent";
import { suggestionAgent } from "../actions/runSuggestionAgent";
import TextareaForm from "./inputs/TextareaForm";
import GridLoader from "react-spinners/GridLoader";
import SheetClient from "./SheetClient";
import EditableSyntaxHighlighter from "./EditableSyntaxHighlighter";
import Accordion from "./Accordion";
import { useQueryStore } from "../hooks/useQueryStorage";

const TextInput: React.FC = () => {
	const queryStore = useQueryStore();
	// console.log("queryStore", queryStore);
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
			{!loading && <Accordion title="Show Query"><EditableSyntaxHighlighter initialCode={query} /></Accordion>}
			{!loading && <SheetClient query={query} />}
			{loading && <GridLoader />}
		</div>
	);
};

export default TextInput;
