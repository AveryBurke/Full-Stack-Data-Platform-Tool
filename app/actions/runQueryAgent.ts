"use server";
import get_data_from_db from "@/app/libs/tools/get_data_from_db.json";
import get_unique_values_from_column from "@/app/libs/tools/get_unique_values_from_column.json";
import get_table_description from "@/app/libs/tools/get_table_description.json";
import get_refering_tables from "@/app/libs/tools/get_refering_tables.json";
import get_example_rows from "@/app/libs/tools/get_example_rows.json";
import OpenAI from "openai";

import { getDataFromDB } from "./getDataFromDB";
import { getTableDescription } from "./discoverDBStructure";
import { getUniqueValues } from "./getUniqueValues";
import { getReferingTables } from "./getReferingTables";
import { getExampleRows } from "./getExampleRows";
import { agent } from "./runAgent";
import { rawQuery } from "./rawQuery";

import { generateSystemPrompts } from "./generateSystemPrompt";
/**
 * Runs a conversation with the AI model (gpt-3.5-turbo-0125) to parse a request for data into an SQL query and run it against the AACT database.
 * The conversation uses function calling to return structured data.
 * @param request a request for data
 * @returns the result of the last function call in the conversation. This should be data from the database.
 */
export const queryAgent = async (request: string) => {
	const systePrompt = await generateSystemPrompts();
	const tools: OpenAI.ChatCompletionTool[] = [
		{ type: "function", function: get_unique_values_from_column },
		{ type: "function", function: get_data_from_db },
		{ type: "function", function: get_table_description },
		{ type: "function", function: get_refering_tables },
		{ type: "function", function: get_example_rows },
	];
	const callback = async (query: string) => {
		return query;
	};

	const get_uniqe_values_from_column = async (tableName: string, columnName: string) => {
		const res = await getUniqueValues(tableName as Model, columnName);
		const onlyPositiveNumbers = res.match(/\d+/g);
		if (onlyPositiveNumbers) {
			return `There are ${res} unique values in the ${columnName} column of the ${tableName} table. Do not search for individual values in this column.`;
		} else if (res === "No data found.") {
			return res;
		}
		return `The unique values in the ${columnName} column of the ${tableName} table are: ${res}. Use these values to search for specific data in the column or to filter the data in the column.`;
	};

	const availableTools: AvailableTools = {
		get_data_from_db: getDataFromDB,
		get_table_description: (tableName: string) => getTableDescription(tableName as Model, "ctgov", true),
		// get_database_description: () => getDBSchema("ctgov"),
		get_uniqe_values_from_column,
		get_refering_tables: getReferingTables,
		get_example_rows: (row: string) => getExampleRows(row, 5),
		request_data_from_db: getDataFromDB,
	};
	const message = await agent({
		userInput: request,
		tools,
		availableTools,
		systePrompt,
		model: "gpt-3.5-turbo-0125",
		conversationLimit: 10,
		callback,
	});
	return message;
};
