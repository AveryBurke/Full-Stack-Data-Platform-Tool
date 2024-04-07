import React, { useRef, useState } from "react";
// import { queryAgent } from "@/app/actions/runQueryAgent";
// import { suggestionAgent } from "../actions/runSuggestionAgent";
// // import executeQuery from "@/app/actions/runAgent";
// import Table from "@/app/components/Table";
// import GridLoader from "react-spinners/GridLoader";
// import DeveloperFeedbackButton from "./DeveloperFeedbackButton";

interface TextareaFormProps {
	enableDeveloperFeedbackButton?: boolean;
	title: string;
	handleSubmit: (value: string) => void;
	handleSecondaryAction?: (value: string) => void;
	sunmitButtonLabel: string;
	secondaryButtonLabel?: string;
	placeholder?: string;
	loading?: boolean;
	value?: string;
}

const TextareaForm: React.FC<TextareaFormProps> = ({
	title,
	enableDeveloperFeedbackButton,
	handleSubmit,
	handleSecondaryAction,
	sunmitButtonLabel,
	secondaryButtonLabel,
	placeholder,
	loading
}) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const submitHanlder = (event: React.FormEvent) => {
		event.preventDefault();
		handleSubmit(inputRef.current ? inputRef.current.value : "");
	}
	const secondaryActionHandler = (event: React.FormEvent) => {
		event.preventDefault();
		if (handleSecondaryAction) {
			handleSecondaryAction(inputRef.current ? inputRef.current.value : "");
		}
	
	}
	return (
		<>
			<form onSubmit={submitHanlder}>
				<div className="m-6">
					<div className="mb-6">
						<label htmlFor="textarea" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							{title}
						</label>
						<textarea
							ref={inputRef}
							id="textarea"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder={placeholder}
							required
						/>
					</div>
					<div className="flex flex-row gap-6">
						<button
							disabled={loading}
							type="submit"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							{sunmitButtonLabel}
						</button>
						{handleSecondaryAction && (
							<button
								disabled={loading}
								type="button"
								onClick={secondaryActionHandler}
								className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
								{secondaryButtonLabel}
							</button>
						)}
						{/* {enableDeveloperFeedbackButton && <DeveloperFeedbackButton prompt={inputRef.current ? inputRef.current.value : ""} query={query} />} */}
					</div>
				</div>
			</form>

			{/* <div className="flex justify-center mx-auto py-8 pr-8 max-h-96 overflow-y-scroll">
				{loading ? <GridLoader color="#3B82F6" /> : queryResult ? <Table data={queryResult} /> : "no results yet"}
			</div> */}
		</>
	);
};

export default TextareaForm;
