import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { models } from "@/app/types";
import prisma from "@/app/libs/prismadb";

/**
 * Runs a query against the database and returns a description of the data.
 * This is a helper function for the queryAgent function.
 * The agent can test a query without reading the raw data.
 * @param query the query to run against the database.
 * @returns a description of the data containing the number of rows returned and the columns in the data. Or an error message if the query is invalid.
 * @example
 *   const query = "SELECT * FROM studies LIMIT 10";
 *   const description = await getDataFromDB(query);
 *   console.log(description);
 *  // The query returned 10 rows. The columns are: id, nct_id, brief_title, official_title, ...
 */
export async function getDataFromDB(query: string): Promise<string> {
	const afterFromRegex = /FROM\s+(\w+)\s/g;
	var match = afterFromRegex.exec(query);
	if (!match || !models.includes(match[1] as Model))
		return `The query is invalid. ${match ? match[1] : "table_name"} is not a valid table. Please try again. These are the valid tables: ${models.join(", ")}`;
	try {
		const res = await prisma.$executeRawUnsafe(query);
		if (res > 0) {
			const response: any[] = await prisma.$queryRawUnsafe(query);
			const columns = Object.keys(response[0]);
			return `The data returned by the database has ${res} rows with the following columns: ${columns.join(", ")}. If the data matches the user's request, end the conversation. Otherwise, rewrite your query and validate it using the get_data_from_db function.`;
		}
		return `The data returned by the database has 0 rows and no columns. If the data matches the user's request, end the conversation. Otherwise, rewrite your query and validate it using the get_data_from_db function.`;
	} catch (e: any) {
		if (e instanceof PrismaClientKnownRequestError) {
			//@ts-ignore
			const { message, code } = e.meta;
			let errorMessage = `The query ${query} is not valid because the ${message}`;
			switch (code) {
				// pgsql missing column error
				// case "42703":
				// 	errorMessage += `. You must rewrite the query. Do not subsitute the missing column for another column in the ${match[1]} table.  Use the foriegn key and subsitute the missing column for a column in the table linked to the foreign key.  The new column can have a similar name to the missing column.`;
				// 	break;

				default:
					errorMessage += " You must rewrite the query.";
					break;
			}
			return errorMessage;
		}
		return e;
	}
}
