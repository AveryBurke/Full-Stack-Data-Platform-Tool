import React, { useRef, useState } from "react";

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
						<label htmlFor="textarea" className="block mb-2 text-sm font-medium text-slate-50 dark:text-slate-50">
							{title}
						</label>
						<textarea
							ref={inputRef}
							id="textarea"
							className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-50 dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder={placeholder}
							required
						/>
					</div>
					<div className="flex flex-col gap-2 @sm:flex-row @sm:gap-6">
						<button
							disabled={loading}
							type="submit"
							className="text-slate-50 bg-[#61afef] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-[#61afef] dark:focus:ring-blue-800">
							{sunmitButtonLabel}
						</button>
						{handleSecondaryAction && (
							<button
								disabled={loading}
								type="button"
								onClick={secondaryActionHandler}
								className="text-slate-50 bg-[#61afef] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-[#61afef] dark:focus:ring-blue-800">
								{secondaryButtonLabel}
							</button>
						)}
						{/* {enableDeveloperFeedbackButton && <DeveloperFeedbackButton prompt={inputRef.current ? inputRef.current.value : ""} query={query} />} */}
					</div>
				</div>
			</form>
		</>
	);
};

export default TextareaForm;
