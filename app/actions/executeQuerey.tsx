"use server";
import client from "@/app/libs/openAiClient";
import prisma from "@/app/libs/prismadb";
import getExamples from "@/app/libs/examples";
import { getTableDescription, getDBSchema } from "./discoverDBStructure";
import OpenAI from "openai";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { models } from "@/app/types";

async function getDataFromDB(query: string): Promise<string> {
	console.log("query:", query);
	const afterFromRegex = /FROM\s+(\w+)\s/g;
	var match = afterFromRegex.exec(query);
	if (!match || !models.includes(match[1] as Model))
		return `The query is invalid. ${match ? match[1] : "table_name"} is not a valid table. Please try again. These are the valid tables: ${models.join(", ")}`;
	try {
		const res = await prisma.$executeRawUnsafe(query);
		if (res > 0) {
			const response: any[] = await prisma.$queryRawUnsafe(query);
			const columns = Object.keys(response[0]);
			return `The query returned ${res} rows. The columns are: ${columns.join(", ")}.`;
		}
		return `The query "${query}" returned 0 rows. Please rewrite the query to get the data you need.`;
	} catch (e: any) {
		if (e instanceof PrismaClientKnownRequestError) {
			const { message } = e;
			// console.log("e:", e);
			// const message = e.message.split("Message:");
			// console.log("message:", message);
			// const m = message[message.length - 1];
			// console.log("m:", m);
			// let missingColumn: string = "";
			// const col = m.match(/\"([^\"]*)\"/g);
			// console.log("col:", col);
			// if (col) {
			// 	missingColumn = col[1];
			// }
			// let tableDescription: string = "";
			// // if (models.includes(match[1] as Model)) {
			// // 	tableDescription = await getTableDescription(match[1] as Model, "ctgov");
			// // }
			// console.error(
			// 	`The query ${query} was not correct because the table "${match[1]}" does contain a column named ${missingColumn}. Try checking using getTableDescription function to see if ${match[1]} has a column with a similar name to ${missingColumn}. Or try using the getTableDescription to check it the "Refering Tables" section of the table description the table description has a table with a similar name to ${missingColumn}. Rewrite the query using that information.`
			// );
			return `That query yeilds the following error "${message}." If you encounter an error due to an undefined column, try rewriting using the getTableDescription function to check if the table has a similar name. Or refer to the table description and look under the "Referring Tables" section for a table with a name like the column. Then rewrite the query using that information to resolve the issue.`;
		}
		return e;
	}
}

const tools: OpenAI.ChatCompletionTool[] = [
	{
		type: "function",
		function: {
			name: "query_database",
			description: "Sends a SQL query to the database and returns the result",
			parameters: {
				type: "object",
				properties: {
					query: {
						type: "string",
						description: "a valid SQL query",
					},
				},
				required: ["query"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "get_table_description",
			description: "Get a detailed description of a table in the database.",
			parameters: {
				type: "object",
				properties: {
					table_name: {
						type: "string",
						description: "The name of the table.",
					},
				},
				required: ["table_name"],
			},
		},
	},
];

const getTableDescriptionInCtgov = async (tableName: string) => {
	const tableDescription = await getTableDescription(tableName as Model, "ctgov", true, true);
	return tableDescription;
};

const availableTools = {
	query_database: getDataFromDB,
	get_table_description: getTableDescriptionInCtgov,
};

export default async function agent(userInput: string): Promise<DiscriminatedMessage> {
	console.log("userInput:", userInput);
	const examples = await getExamples();
	const schemaString = await getDBSchema("ctgov");
	console.log("schemaString:", schemaString);
	const messages = examples.reduce<OpenAI.ChatCompletionMessageParam[]>(
		(acc, example) => {
			acc.push({
				role: "user",
				content: example.Prompt,
			});
			acc.push({
				role: "assistant",
				content: example.Query,
			});
			return acc;
		},
		[
			{
				role: "system",
				content:
					"Act as a data scientist. You must convert text prompts into SQL queries for a database. When comparing foreign keys or primary keys, use the '=' operator, otherwise Favor the 'ILIKE' operator over '=' operator when searching a column with a WHERE clause. The database contains the following tables and their corresponding fields: \n" +
					schemaString,
			},
		]
	);

	messages.push({
		role: "user",
		content: userInput,
	});
	let currentArg = "";
	for (let i = 0; i < 8; i++) {
		const response = await client.chat.completions.create({
			model: "gpt-3.5-turbo-0125",
			temperature: 0.3,
			messages: messages,
			tools: tools,
		});

		const { finish_reason, message } = response.choices[0];
		console.log("finish_reason:", finish_reason);
		if (finish_reason === "tool_calls" && message.tool_calls) {
			const functionName = message.tool_calls[0].function.name;
			const functionToCall = availableTools[functionName as "query_database" | "get_table_description"];
			const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
			const functionArgsArr: string[] = Object.values(functionArgs);
			if (functionName === "query_database") {
				currentArg = functionArgsArr[0];
			}
			console.log("going to call ", functionName, " with args ", functionArgsArr);
			console.log("currentArg:", currentArg);
			const functionResponse: string = await functionToCall.apply(null, functionArgsArr as [string]);
			console.log("functionResponse:", functionResponse);
			messages.push({
				role: "function",
				name: functionName,
				content: functionResponse,
			});
		} else if (finish_reason === "stop") {
			messages.push(message);
			// messages.push({
			// 	role: "system",
			// 	content:
			// 		"Act a SQL translator. Describe the data the would be returned by a SQL query, based on the user's input and the description of the ctgov database schema. For example: '100 Phase 3 studies, where the offical title contains the word 'cancer'; ordered by start date' Here is a description of the ctgov database: " +
			// 		schemaString,
			// });
			const data = await prisma.$queryRawUnsafe<any[]>(currentArg);
			const query = currentArg;
			return { message: "success", payload: { data, query } };
		}
	}
	return {
		message: "error",
		payload: { error: "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input" },
	};
}
