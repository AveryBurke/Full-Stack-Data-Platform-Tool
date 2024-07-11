"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { mergeQueryResults } from "@/app/actions/mergeQueryResults";
import CodeEditor from "./codeEidtor/CodeEditor";
import { format } from "sql-formatter";
import toast from "react-hot-toast";

const Page = () => {
	const minWidth = 100;
	const queryStore = useQueryStore();
	// keep the code state out of the editor component so it is not reset when the component is re-rendered
	const fromatWithExeptions = (code: string) => {
		try {
			return format(code, { language: "postgresql" });
		} catch (error) {
			toast.error("Error formatting query");
			return code;
		}
	}

	const [code, setCode] = useState(fromatWithExeptions(queryStore.query));
	const [componentMaxHeight, setComponentMaxHeight] = useState(0);
	const [renderComponent, setRenderComponent] = useState(true);

	

	const handleQuerySubmit = () => {
	
		if (code !== queryStore.query) {
			// console.log("submitting query");
			// console.log("code ", code)
			// the sheet component will only fetch new data if the current data is empty
			// queryStore.setData([]); // NOTE: this is causing problems mergeing the data in the pizza chart.
			const unformat =  code.replace(/\n/g, " ").replace(/ +/g, ' ').trim();
			queryStore.setQuery(unformat);
		} else {
			// console.log("query is the same");
		}
	};

	// const hangleMerge = () => {
	// 	if (code !== queryStore.query) {
	// 		const merged = mergeQueryResults();
	// 		const unformat =  code.replace(/\n/g, " ").replace(/ +/g, ' ').trim();
	// 		queryStore.setQuery(unformat);
	// 	}
	// };

	useEffect(() => {
		setCode(fromatWithExeptions(queryStore.query));
	}, [queryStore.query]);

	// Set the height of the CodeEditor to the height of the parent container
	const measuredRef = useCallback((node: HTMLDivElement) => {
		if (!node) return;
		const resizeObserver = new ResizeObserver(() => {
			setComponentMaxHeight(node.getBoundingClientRect().height - 15);
			if (node.getBoundingClientRect().width < minWidth) setRenderComponent(false);
			else setRenderComponent(true);
		});
		resizeObserver.observe(node);
		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className="p-2 bg-slate-50 h-full" ref={measuredRef}>
			{renderComponent && <CodeEditor
				height={componentMaxHeight}
				code={code}
				onChange={(code: string) => setCode(code)}
				isLoading={queryStore.isLoading}
				onSubmit={handleQuerySubmit}
			/>}
		</div>
	);
};

export default Page;
