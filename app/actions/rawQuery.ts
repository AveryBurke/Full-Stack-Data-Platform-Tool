"use server";
import prisma from "@/app/libs/prismadb";
import { sanitize } from "@/app/libs/sanitize";

export const rawQuery = async (query: string):Promise<any[]> => {
	try {
		const data = await prisma.$queryRawUnsafe<any[]>(query);
		return data
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		return []
	}
};