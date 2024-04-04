"use server"
import fs from "fs";
import csvParser from "csv-parser";

interface Example {
	prompt: string;
	query: string;
}

export default async function getExamples(): Promise<Example[]> {
	const result: Example[] = [];
	return new Promise((resolve, reject) => {
		fs.createReadStream(process.cwd() + "/app/static/exampleQueries.csv", "utf8")
			.pipe(csvParser())
			.on("data", (data) => {
				result.push(data);
			})
			.on("end", () => {
				resolve(result);
			});
	});
}
