"use client";
import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
interface SheetProps {
	data: any[];
	onDataChange?: (data: any[]) => void;
}
/**
 * an editable spreadsheet component.
 * This component uses the Tabulator library to render a spreadsheet.
 */
const Sheet: React.FC<SheetProps> = ({ data, onDataChange }) => {
	const tableNameRef = useRef<HTMLInputElement>(null);
	const ref = useRef<any>(null);
	const refTable = useRef<Tabulator | null>(null);
	const handleDownload = () => {
		const name = tableNameRef.current?.value || "Data";
		if (refTable.current) {
			refTable.current.download("xlsx", `${name}.xlsx`);
		}
	};

	useEffect(() => {
		if (ref.current) {
			const table = new Tabulator(ref.current, {
				height: "550px",

				spreadsheet: true,
				// spreadsheetRows: 50,
				// spreadsheetColumns: 50,
				spreadsheetColumnDefinition: { editor: "input", resizable: "header" },
				//@ts-ignore
				spreadsheetData: data,
				// spreadsheetSheetTabs: true,

				rowHeader: { field: "_id", hozAlign: "center", headerSort: false, frozen: true },

				editTriggerEvent: "dblclick", //change edit trigger mode to make cell navigation smoother
				editorEmptyValue: undefined, //ensure empty values are set to undefined so they arent included in spreadsheet output data

				//enable range selection
				selectableRange: 1,
				selectableRangeColumns: true,
				selectableRangeRows: true,
				selectableRangeClearCells: true,

				//configure clipboard to allow copy and paste of range format data
				clipboard: true,
				clipboardCopyStyled: false,
				clipboardCopyConfig: {
					rowHeaders: false,
					columnHeaders: false,
				},
				clipboardCopyRowRange: "range",
				clipboardPasteParser: "range",
				clipboardPasteAction: "range",
			});

			refTable.current = table;
			table.on("dataChanged", (data) => {
				if (onDataChange) onDataChange(data);
			});
		}
		return () => {
			if (refTable.current) {
				refTable.current.destroy();
				refTable.current = null;
			}
		};
	}, [data]);
	return (
		<div className="w-full h-full p-3 flex flex-col content-center">
			<input
				type="text"
				ref={tableNameRef}
				placeholder="Table Name"
				className=" w-40 h-8 py-3 px-4 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
			/>

			<div className="p-2">
				<div ref={ref} className="spreadsheet"></div>
			</div>

		</div>
	);
};

export default Sheet;
