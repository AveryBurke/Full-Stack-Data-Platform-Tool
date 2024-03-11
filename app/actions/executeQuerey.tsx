"use server";
import client from "@/app/libs/openAiClient";
import prisma from "@/app/libs/prismadb";
import discoverDBStructure from "./discoverDBStructure";
import OpenAI from "openai";
import Prisma, { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { json } from "node:stream/consumers";

const models = [
	"baseline_counts",
	"baseline_measurements",
	"brief_summaries",
	"browse_conditions",
	"browse_interventions",
	"calculated_values",
	"central_contacts",
	"conditions",
	"countries",
	"design_group_interventions",
	"design_groups",
	"design_outcomes",
	"designs",
	"detailed_descriptions",
	"drop_withdrawals",
	"eligibilities",
	"facilities",
	"facility_contacts",
	"facility_investigators",
	"id_information",
	"intervention_other_names",
	"interventions",
	"ipd_information_types",
	"keywords",
	"links",
	"mesh_headings",
	"mesh_terms",
	"milestones",
	"outcome_analyses",
	"outcome_analysis_groups",
	"outcome_counts",
	"outcome_measurements",
	"outcomes",
	"overall_officials",
	"participant_flows",
	"pending_results",
	"provided_documents",
	"reported_event_totals",
	"reported_events",
	"responsible_parties",
	"result_agreements",
	"result_contacts",
	"result_groups",
	"retractions",
	"search_results",
	"sponsors",
	"studies",
	"study_references",
	"study_searches",
] as const;

type Model = (typeof models)[number];

async function getDataFromDB(query: string) {
	const afterFromRegex = /FROM\s+(\w+)\s/g;
	var match = afterFromRegex.exec(query);
	if (!match || !models.includes(match[1] as Model))
		return `The query is invalid. ${match ? match[1] : "table_name"} is not a valid table. Please try again. These are the valid tables: ${models.join(", ")}`;
	try {
		//the raw result is too long for the OpenAi's api, so we just return the number of rows
		//to do: we need a better feedback mechanism. Some kind of analysis of the data, to better guid the AI's next response.
		const res = await prisma.$executeRawUnsafe(query);
		if (res > 0) {
			const response: any[] = await prisma.$queryRawUnsafe(query);
			const columns = Object.keys(response[0]);
			console.log(`The query returned ${res} rows. The columns are: ${columns.join(", ")}`);
			return `The query returned ${res} rows. The columns are: ${columns.join(", ")}`;
		}
		console.log(`The query returned 0 rows.`);
		return `The query returned 0 rows.`;
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			const message = e.message.split("Message:");
			const m = message[message.length - 1];
			console.error("Error executing query:", m);
			console.log("quering for table structure: ", match);
			const tableDescription = await describeTable(match[1]);
			console.error(m + " Please rewrite the query and try using a different column with a similar name.");
			return m + " Please rewrite the query. Refer to the schema for the correct";
		}
		throw e;
	}
}

async function validateQueryForORM(query: string) {
	const afterFromRegex = /FROM\s+(\w+)\s/g;
	var match = afterFromRegex.exec(query);
	if (!match || !models.includes(match[1] as Model))
		return `The query is invalid. ${match ? match[1] : "table_name"} is not a valid table. Please try again. These are the valid tables: ${models.join(", ")}`;
	return true;
}

const tools: OpenAI.ChatCompletionTool[] = [
	{
		type: "function",
		function: {
			name: "getDataFromDB",
			description: "Gets data from the ctgov database based on a SQL query.",
			parameters: {
				type: "object",
				description: "A SQL query to run on the ctgov database. Infer the query from the user's input and the description of the ctgov database schema.",
				properties: {
					query: {
						type: "string",
					},
				},
				required: ["query"],
			},
		},
	},
];

async function describeTable(tableName: string) {
    console.log("tableName:", tableName);
    const tableInfo = await prisma.$queryRaw`
      SELECT 
        c.column_name, 
        c.data_type, 
        kcu.constraint_name AS foreign_key_constraint_name, 
        kcu.table_name AS referenced_table_name, 
        kcu.column_name AS referenced_column_name
      FROM 
        information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu ON c.column_name = kcu.column_name AND c.table_name = kcu.table_name
      WHERE 
        c.table_name = '${tableName}'
      GROUP BY 
        c.column_name, 
        c.data_type, 
        kcu.constraint_name, 
        kcu.table_name, 
        kcu.column_name;
    `;
  
    console.log(tableInfo);
  }

const availableTools = {
	getDataFromDB,
};

export default async function agent(userInput: string) {
	console.log("userInput:", userInput);
	const schemaString = await discoverDBStructure();
	const messages: OpenAI.ChatCompletionMessageParam[] = [
		{
			role: "system",
			content:
				"Act as a data scientist. You must retrieve the appropriate data from the ctgov relational database, in response to a text prompt. Therefore you must parse the text prompt into a valid SQL query for the ctgov database. Here is description of the ctgov database: " +
				schemaString +
				". Here are the tables you can query: " +
				models.join(", "),
		},
	];

	messages.push({
		role: "user",
		content: userInput,
	});
	let currentArg = "";
	for (let i = 0; i < 5; i++) {
		const response = await client.chat.completions.create({
			model: "gpt-3.5-turbo-0125",
			temperature: 0.3,
			messages: messages,
			tools: tools,
		});

		const { finish_reason, message } = response.choices[0];

		if (finish_reason === "tool_calls" && message.tool_calls) {
			const functionName = message.tool_calls[0].function.name;
			const functionToCall = availableTools[functionName as "getDataFromDB"];
			const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
			const functionArgsArr: string[] = Object.values(functionArgs);
			currentArg = functionArgsArr[0];
			console.log("currentArg:", currentArg);
			const functionResponse = await functionToCall.apply(null, functionArgsArr as [string]);
			messages.push({
				role: "function",
				name: functionName,
				content: `
	              The result of the last function was this: ${JSON.stringify(functionResponse)}
	              `,
			});
		} else if (finish_reason === "stop") {
			messages.push(message);
			messages.push({
				role: "system",
				content:
					"Act a SQL translator. Describe the data the would be returned by a SQL query, based on the user's input and the description of the ctgov database schema. For example: '100 Phase 3 studies, where the offical title contains the word 'cancer'; ordered by start date' Here is a description of the ctgov database: " +
					schemaString,
			});
			console.log("the following query will be run: ", currentArg);
			const response = await prisma.$queryRawUnsafe(currentArg);
			return JSON.stringify(response);
		}
	}
	return JSON.stringify({ message: "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input" });
}
