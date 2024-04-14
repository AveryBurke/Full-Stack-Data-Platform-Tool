"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useQueryStore } from "../hooks/useQueryStorage";
import CodeEditor from "./CodeEditor";
import { format } from "sql-formatter";

/**
 * Container for the editable SQL code editor.
 * Hanldes state and resizing for the CodeEditor component.
 */
const EditableSQLContainer = () => {
	const queryStore = useQueryStore();
	// keep the code state out of the editor component so it is not reset when the component is re-rendered
	const [code, setCode] = useState(format(queryStore.query, { language: "sql" }));
	const [componentMaxHeight, setComponentMaxHeight] = useState(0);

	const handleQuerySubmit = () => {
		if (code !== queryStore.query) {
			// the sheet component will only fetch new data if the current data is empty
			queryStore.setData([]);
			queryStore.setQuery(code);
		}
	};

	useEffect(() => {
		setCode(format(queryStore.query, { language: "sql" }));
	}, [queryStore.query]);

	// Set the height of the CodeEditor to the height of the parent container
	const measuredRef = useCallback((node: HTMLDivElement) => {
		if (!node) return;
		const resizeObserver = new ResizeObserver(() => {
			setComponentMaxHeight(node.getBoundingClientRect().height - 15);
		});
		resizeObserver.observe(node);
		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className="p-2 bg-slate-50 h-full" ref={measuredRef}>
			<CodeEditor
				height={componentMaxHeight}
				code={code}
				onChange={(code: string) => setCode(code)}
				isLoading={queryStore.isLoading}
				onClick={handleQuerySubmit}
			/>
		</div>
	);
};

export default EditableSQLContainer;
