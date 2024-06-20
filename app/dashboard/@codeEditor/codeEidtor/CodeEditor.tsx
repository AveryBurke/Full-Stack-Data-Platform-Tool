"use client";
import Editor from "react-simple-code-editor";
import Prisma from "prismjs";
import PlayButton from "./PlayButton";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";

interface CodeEditorProps {
	onChange: (code: string) => void;
	onClick: () => void;
	isLoading?: boolean;
	code: string;
	height?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, height, onChange, onClick, isLoading}) => {

	return (
		<>
			<div className="flex flex-row justify-end items-start w-full h-auto pb-2">
				<PlayButton handlePlay={onClick} loading={isLoading} />
			</div>
			<Editor
				value={code}
				padding={10}
				onValueChange={(code) => onChange(code)}
				highlight={(code) => Prisma.highlight(code, Prisma.languages.sql, "sql")}
				style={{
					fontFamily: "monospace",
					fontSize: 17,
					border: "1px solid black",
					overflowY: "scroll",
					height: height || 350,
				}}
			/>
			
		</>
	);
};
export default CodeEditor;
