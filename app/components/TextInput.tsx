"use client";
import React, { useRef, useState } from "react";
import { queryAgent } from "@/app/actions/runQueryAgent";
import { suggestionAgent } from "../actions/runSuggestionAgent";
// import executeQuery from "@/app/actions/runAgent";
import Table from "@/app/components/Table";
import GridLoader from "react-spinners/GridLoader";
import DeveloperFeedbackButton from "./DeveloperFeedbackButton";

interface TextInputProps {
	enableDeveloperFeedbackButton?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ enableDeveloperFeedbackButton }) => {
	const [queryResult, setQueryResult] = useState<any[] | null>();
	const [query, setQuery] = useState("");
	const [previousSuggestion, setPreviousSuggestion] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const hanldeSuggestionRequest = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const message = await suggestionAgent(previousSuggestion);
			if (message.message === "success") {
				const { data, query } = message.payload;
				inputRef.current!.value = query;
				setPreviousSuggestion(query);
			}
		} catch (error) {
			console.error("Error getting suggestion:", error);
		
		}
	}
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		const inputValue = inputRef.current?.value;
		if (inputValue) {
			try {
				const message = await queryAgent(inputValue);
				console.log("message", message);
				if (message.message === "success") {
					const { data, query } = message.payload;
					console.log("data", data);
					console.log("query", query);
					if (data.length > 0) {
						setQueryResult(data);
					}
					setQuery(query);
				} else {
					setQueryResult(null);
					setQuery("");
				}
			} catch (error) {
				console.error("Error executing query:", error);
			}
		}
		setLoading(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="m-6">
					<div className="mb-6">
						<label htmlFor="query_feild" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							find something in the database
						</label>
						<input
							ref={inputRef}
							type="query_feild"
							id="query_feild"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Get the first 100 studies with the condition 'cancer' and the intervention 'vaccine.'"
							required
						/>
					</div>
					<div className="flex flex-row gap-6">
						<button
							type="submit"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							Submit
						</button>
						<button
							type="button"
							onClick={hanldeSuggestionRequest}
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							Suggest
						</button>
						{enableDeveloperFeedbackButton && <DeveloperFeedbackButton prompt={inputRef.current ? inputRef.current.value : ""} query={query} />}
					</div>
				</div>
			</form>

			<div className="flex justify-center mx-auto py-8 pr-8 max-h-96 overflow-y-scroll">
				{loading ? <GridLoader color="#3B82F6" /> : queryResult ? <Table data={queryResult} /> : "no results yet"}
			</div>
		</>
	);
};

export default TextInput;
