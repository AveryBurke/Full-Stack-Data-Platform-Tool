"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { rawQuery } from "@/app/actions/rawQuery";
import Sheet from "./Sheet";
import Loader from "@/app/components/Loader";
import { toast } from "react-hot-toast";
import { usePizzaState } from "@/app/hooks/usePizzaState";

/**
 * A wrapper component that fetches data from the server and passes it to the Sheet component.
 * @note Some of the complication with respect to data handling is due to the our goal of letting the user edit the global data in the spreadsheet.
 * This means that we need to keep track of two kinds of changes: a change in the query and a spreadsheet event.
 * When the query changes, we need to fetch new data from the server and update the state destorying the old data and rendring a new sheet.
 * When the user edits the data in the spreadsheet, we need to update the state with the new data.
 * This component is responsible for handling these two kinds of changes.
 * When the component mounts, it needs to fetch data from the server and initialize the sheet with the data from the state, preserving any changes made to the data from the spreadsheet.
 */
const SheetWrapper = () => {
	// const sideba = useSidebar();
	// sideba.setComponent("spreadsheet");
	const numberOfMounts = useRef(0);
	const { query, setQuery, data, setData, onLoading, onFinish, isLoading } = useQueryStore();
	const [sheetData, setSheetData] = useState<any[]>([]);
	const { setOptions } = usePizzaState();
	const formatAndSetSheetData = (data: any[]) => {
		const headers = data.length > 0 ? Object.keys(data[0]) : [];
		const formattedData = [headers, ...data.map((row) => Object.values(row))];
		setSheetData(formattedData);
	};

	useEffect(() => {
		const fetchData = async () => {
			onLoading();
			try {
				const res = await rawQuery(query);
				setData(res);
				const options = Object.keys(res[0]).map((key) => ({ value: key, label: key }));
				setOptions(options);

				formatAndSetSheetData(res);
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Error fetching data");
				}
			}
			setQuery(query);
			onFinish();
		};
		// react 18 introduced a breaking change where components are mounted twice.
		// so we need to keep track of the number of mounts.
		// we only want to fecth new data when the query changes.
		// on mount we want to initialize the sheet with the data from state.
		switch (numberOfMounts.current) {
			// first mount, do nothing
			case 0:
				numberOfMounts.current++;
				return;
			case 1:
				// second mount, get data from state and initilize the sheet
				// initializing data from state preserves any changes made to the data from the spreadsheet
				numberOfMounts.current++;
				formatAndSetSheetData(data);
				return;
			default:
				// any further trigger of useEffect is a change in the query and should result in a fetch and new data
				// this fetch will update the state and the sheet, destroying any changes made to the data from the spreadsheet
				fetchData();
				break;
		}
	}, [query]);

	// NOTE: Tabulator spreadsheet expects data to be arrays of values
	// while we are currently saving data in state as arrays of objects.
	// this introduces some friction when updating the spreadsheet.
	// We might want to consider using a different Tabulator configuration so that we can use objects instead of arrays.

	// format spreadsheet data to match state data
	// state data looks like [{name: "John", age: 20}, {name: "Jane", age: 30}]
	// spreadsheet data looks like [["name", "age"], ["John", 20], ["Jane", 30]]
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
