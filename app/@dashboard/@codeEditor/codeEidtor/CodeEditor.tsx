"use client";
import Editor from "react-simple-code-editor";
import Prisma from "prismjs";
import PlayButton from "./PlayButton";
import MergeButton from "./MergeButton";
import { usePizzaState } from "@/app/hooks/usePizzaState";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";

interface CodeEditorProps {
	onChange: (code: string) => void;
	onSubmit: () => void;
	isLoading?: boolean;
	code: string;
	height?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, height, onChange, onSubmit, isLoading }) => {
	const { primaryColumn } = usePizzaState();
	return (
		<>
			<div className="absolute top-3 right-3 z-50">
				{primaryColumn === "internalId" ? <PlayButton handlePlay={onSubmit} loading={isLoading} /> : <MergeButton hanldeClick={onSubmit} loading={isLoading} />}
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
