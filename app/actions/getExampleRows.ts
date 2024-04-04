"use server";
import prisma from "../libs/prismadb";
import { sanitize } from "../libs/sanitize";
import { Prisma } from "@prisma/client";

export async function getExampleRows(tableName: string, numberOfRows: number): Promise<string> {
	try {
		const res = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM ${tableName} LIMIT ${numberOfRows};`);
		// const header = Object.keys(res[0]).join(" | ");
		const rows = res.reduce<string>((acc, row, i) => {
			const sanitizedRow = sanitize(row);
			const values = truncatedObjectValues(sanitizedRow, 100).join(" | ");
			return `${acc}${i + 1}. ${values}\n`;
		}, "");
		return rows;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return "An error occurred while fetching the data.";
		}
	}
}

/**
 * Returns the values of an object, truncated if they are strings and longer than maxLength.
 * @param obj any object
 * @param maxLength the max length of a string
 * @returns the values of an object, truncated if they are strings and longer than maxLength.
 */
function truncatedObjectValues(obj: { [key: string]: any }, maxLength: number): any[] {
	return Object.entries(obj).map(([key, value]) => {
		if (typeof value === "string" && value.length > maxLength) {
			return value.trim().slice(0, maxLength) + "...";
		}
		return value;
	});
}
