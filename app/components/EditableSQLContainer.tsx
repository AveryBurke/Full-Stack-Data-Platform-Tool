"use client";
import React, { memo, useState } from "react";
import useQueryStore from "../hooks/useQueryStorage";
import EditableSyntaxHighlighter from "./EditableSyntaxHighlighter";
import PlayButton from "./PlayButton";

// TODO: Sumbit handler to runs server action and store the new query
const EditableSQLContainer = () => {
	const queryStore = useQueryStore();
	const Memoized = memo(() => <EditableSyntaxHighlighter initialCode={queryStore.query} />);
	const [loading, setLoading] = useState(false);
	const handlePlay = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2000);
	}
	return (
		<div className="p-2">
			<div className="mb-2">
				<Memoized />
			</div>{" "}
			<div className=" absolute top-3 right-3">
				<PlayButton handlePlay={handlePlay} loading = {loading} />
			</div>
		</div>
	);
};

export default EditableSQLContainer;
