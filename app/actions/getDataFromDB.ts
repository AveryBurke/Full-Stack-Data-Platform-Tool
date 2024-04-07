import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { models } from "@/app/types";
import prisma from "@/app/libs/prismadb";

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
			return `The query returned ${res} rows. The columns are: ${columns.join(", ")}.`;
		}
		return `The query "${query}" returned 0 rows. Please rewrite the query to get the data you need.`;
	} catch (e: any) {
		if (e instanceof PrismaClientKnownRequestError) {
			console.log("e:", e.meta);
			//@ts-ignore
			const { message, code } = e.meta;
			let errorMessage = `The query ${query} is not valid because the ${message}`;
			switch (code) {
				// pgsql missing column error
				case "42703":
					errorMessage += `. You must rewrite the query. Do not subsitute the missing column for another column in the ${match[1]} table.  Use the foriegn key and subsitute the missing column for a column in the table linked to the foreign key.  The new column can have a similar name to the missing column.`;
					break;

				default:
					errorMessage += " You must rewrite the query.";
					break;
			}
			return errorMessage;
		}
		return e;
	}
}
