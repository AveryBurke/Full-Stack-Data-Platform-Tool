"use client";
import React, { memo, useState, useEffect } from "react";
import useQueryStorage from "@/app/hooks/useQueryStorage";
import { rawQuery } from "../actions/rawQuery";
import Sheet from "./Sheet";
import Loader from "./Loader";

const SheetWrapper = () => {
	const queryStore = useQueryStorage();
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await rawQuery(queryStore.query);
			const columnHeaders = Object.keys(data[0]).map((key) => key.charAt(0).toUpperCase() + key.slice(1));
			const spreadsheetData = [columnHeaders, ...data.map((row) => Object.values(row))];
			setData(spreadsheetData);
		};
		if (queryStore.query.length > 0) fetchData();
	}, [queryStore.query]);

	const Memo = memo(() => <Sheet data={data} />);
	return queryStore.isLoading ? <Loader /> : <div className="w-full h-full p-2 relative flex flex-col justify-center content-center"><Memo /></div>;
};

export default SheetWrapper;
