"use client";
import React, { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/hljs";
import { format } from "sql-formatter";
import { text } from "stream/consumers";

interface EditableSyntaxHighlighterProps {
	theme?: keyof typeof themes;
	initialCode: string;
}

/**
 * An editable syntax highlighter component.
 * This component hides an invisible text area in front of a react-syntax-highlighter component.
 */
const EditableSyntaxHighlighter: React.FC<EditableSyntaxHighlighterProps> = ({ initialCode, theme }) => {
	console.log("initialCode", initialCode);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const syntaxHighlighterRef = useRef<HTMLDivElement>(null);
	const frommatedCode = format(initialCode, {
		language: "postgresql",
	});
	const [code, setCode] = useState(frommatedCode);
	useEffect(() => {
		const handleScroll = () => {
			console.log("textareaRef", textareaRef.current);
			console.log("syntaxHighlighterRef", syntaxHighlighterRef.current);
			if (textareaRef.current && syntaxHighlighterRef.current) {
				
			}
			// console.log("textareaElement", textareaElement);
			// console.log("syntaxHighlighterElement", syntaxHighlighterElement);
			// syntaxHighlighterElement?.scrollTo({
			// 	top: textareaElement.scrollTop,
			// 	left: textareaElement.scrollLeft,
			// });
		};
		if (textareaRef.current) {
			textareaRef.current.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (textareaRef.current) {
				textareaRef.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);
	return (
		<div
			role="button"
			tabIndex={0}
			onKeyDown={() => textareaRef.current?.focus()}
			onClick={() => textareaRef.current?.focus()}
			className={"mb-2 relative grid bg-[#282a36]"}>
			<div className="overflow-y-scroll overflow-x-hidden">
				<textarea
					className={"gird absolute inset-0 resize-none bg-transparent p-2 font-mono text-transparent caret-white outline-none"}
					ref={textareaRef}
					value={code}
					onChange={() => setCode(textareaRef.current?.value || "")}
				/>
				<div ref={syntaxHighlighterRef}>
					<SyntaxHighlighter
						id="syntax-highlighter"
						language="sql"
						style={themes.atomOneDark}
						customStyle={{
							flex: "1",
							background: "transparent",
							overflowX: "hidden",
							overflowY: "scroll",
							maxHeight: "100%",
						}}>
						{code}
					</SyntaxHighlighter>
				</div>
			</div>
		</div>
	);
};

export default EditableSyntaxHighlighter;
