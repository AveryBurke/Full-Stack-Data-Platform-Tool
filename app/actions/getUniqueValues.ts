import prisma from "../libs/prismadb";
import { Prisma } from "@prisma/client";
export async function getUniqueValues(tableName: Model, columnName: string, limit = 21): Promise<string> {
	const temp = 
    `SELECT 
    	CASE 
        	WHEN count_distinct > ${limit} THEN count_distinct::text 
        	ELSE (SELECT string_agg(DISTINCT ${columnName}, ', ') FROM ${tableName}) 
    	END AS result
	FROM (
		SELECT 
			COUNT(DISTINCT ${columnName}) AS count_distinct
		FROM 
			${tableName}
	) AS subquery;`;
	try {
		const res = await prisma.$queryRawUnsafe<{ result: string }[]>(temp);
		if (res.length === 0) {
			return "No data found.";
		}
		return res[0].result;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return "An error occurred while fetching the data.";
		}
	}
}
