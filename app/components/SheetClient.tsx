import Sheet from "./Sheet";
import React, { useState, useEffect } from "react";
import { rawQuery } from "../actions/rawQuery";

interface SheetClientProps {
	query: string;
}
const SheetClient: React.FC<SheetClientProps> = ({ query }) => {
	const [data, setData] = useState<any[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const rawdata = await rawQuery(query);
				const firstRow: any[] = Object.keys(rawdata[0]).map((header) => header.charAt(0).toUpperCase() + header.slice(1));
				const formatedData = [firstRow];
				for (let i = 0; i < rawdata.length; i++) {
					formatedData.push(Object.values(rawdata[i]));
				}
				setData(formatedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
		return () => {
			setData([]);
		};
	}, [query]);
	return <Sheet data={data} />;
};

export default SheetClient;
