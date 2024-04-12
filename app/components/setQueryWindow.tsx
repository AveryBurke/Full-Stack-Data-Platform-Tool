"use client";
import React from "react";
import useQueryStore from "../hooks/useQueryStorage";

const setQueryWindow = () => {
	const queryStore = useQueryStore();
	const hanldeClick = () => {
		queryStore.onLoading();
		setTimeout(() => {
			queryStore.setQuery("Hello World");
			queryStore.onFinish();
		}, 2000);
	};
	return (
		<button
			disabled={queryStore.isLoading}
			type="button"
			onClick={hanldeClick}
			className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
			test query
		</button>
	);
};

export default setQueryWindow;
