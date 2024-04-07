import Sheet from "./Sheet";
import React, { use, useEffect, useState } from "react";
import { rawQuery } from "../actions/rawQuery";
import { set } from "date-fns";
import { ta } from "date-fns/locale";

interface SheetClientProps {
	query: string;
}
const SheetClient: React.FC<SheetClientProps> = ({ query }) => {
	const [data, setData] = useState<any[]>([]);
	var tabledata = [
		{ id: 1, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: 1 },
		{ id: 2, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: true },
		{ id: 3, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: "true" },
		{ id: 4, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980" },
		{ id: 5, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999" },
		{ id: 6, name: "Frank Harbours", progress: 38, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: 1 },
	];

	useEffect(() => {
		const firstRow: any[] = Object.keys(tabledata[0]).map((header) => header.charAt(0).toUpperCase() + header.slice(1));
        const formatedData = [firstRow];
		for (let i = 0; i < tabledata.length; i++) {
			formatedData.push(Object.values(tabledata[i]));
		}
        console.log("Formated Data:", formatedData);
        setData(formatedData);
        // console.log("Data:", data);
		// console.log("Query:", query);
		// const fetchData = async () => {
		// 	try {
		// 		const data = await rawQuery(query);
		// 		setData(data);
		// 	} catch (error) {
		// 		console.error("Error fetching data:", error);
		// 	}
		// };
		// fetchData();
	}, []);
	return <Sheet data={data} />;
};

export default SheetClient;
