"use client";
import React, { memo, useState, useEffect, use } from "react";
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { rawQuery } from "../actions/rawQuery";
import Sheet from "./Sheet";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

const SheetWrapper = () => {
	const { query, data, setData, onLoading, onFinish, isLoading } = useQueryStore();
	const [sheetData, setSheetData] = useState<any[]>([]);

	// initialize with session data, if it exists
	useEffect(() => {
		if (data.length > 0) {
			const headers = Object.keys(data[0]);
			const formattedData = [headers, ...data.map((row) => Object.values(row))];
			setSheetData(formattedData);
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			onLoading();
			try {
				const data = await rawQuery(query);
				setData(data);
				const headers = data.length > 0 ? Object.keys(data[0]) : [];
				const formattedData = [headers, ...data.map((row) => Object.values(row))];
				setSheetData(formattedData);
			} catch (error) {
				if (error instanceof Error) {
					console.error("Error fetching data:", error.message);
					toast.error(error.message);
				} else {
					toast.error("Error fetching data");
				}
			}

			onFinish();
		};
		// only fetch new data if previous data was cleared
		if (data.length === 0) fetchData();
	}, [query, data]);

	// NOTE: Tabulator spreadsheet expects data to be arrays of values
	// while we are currently saving data in state as arrays of objects.
	// this introduces some friction when updating the spreadsheet.
	// We might want to consider using a different Tabulator configuration so that we can use objects instead of arrays.

	// format spreadsheet data to match state data
	const handleDataChange = (data: any[]) => {
		const values: any[] = data.map((row) => Object.values(row).slice(1));
		const keys: string[] = values[0];
		const objs: any[] = [];
		for (let i = 1; i < values.length; i++) {
			const obj: any = {};
			for (let j = 0; j < keys.length; j++) {
				obj[keys[j]] = values[i][j];
			}
			objs.push(obj);
		}
		setData(objs);
	};

	return isLoading ? <Loader color="#e6c07b" /> : <Sheet data={sheetData} onDataChange={handleDataChange} />;
};

export default SheetWrapper;
