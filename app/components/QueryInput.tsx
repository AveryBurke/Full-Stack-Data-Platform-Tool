"use client";
import React, { useRef, useState, memo } from "react";
import { queryAgent } from "@/app/actions/runQueryAgent";
import { suggestionAgent } from "../actions/runSuggestionAgent";
import TextareaForm from "./inputs/TextareaForm";
import { useQueryStore } from "../hooks/useQueryStorage";
import { toast } from "react-hot-toast";

const TextInput: React.FC = () => {
	const queryStore = useQueryStore();
	const [previousSuggestion, setPreviousSuggestion] = useState<string | null>(null);
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
	const handleSubmit = async (request: string) => {
		queryStore.onLoading();
		try {
			const message = await queryAgent(request);
			if (message.type === "success") {
				queryStore.setData([]);
				const unformat =  message.message.replace(/\n/g, " ").replace(/ +/g, ' ').trim();
				queryStore.setQuery(unformat);
			} else {
				queryStore.setQuery("");
			}
		} catch (error) {
			toast.error("Error executing query.");
		}
		queryStore.onFinish();
	};

	return (
		<div>
			<TextareaForm
				handleSubmit={handleSubmit}
				handleSecondaryAction={hanldeSuggestionRequest}
				loading={queryStore.isLoading}
				title="Fetch data"
				placeholder="Enter your request here."
				sunmitButtonLabel="Fetch"
				secondaryButtonLabel="Suggest"
			/>
		</div>
	);
};

export default TextInput;
