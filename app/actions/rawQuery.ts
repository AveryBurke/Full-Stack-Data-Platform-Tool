"use server";
import prisma from "@/app/libs/prismadb";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const rawQuery = async (query: string): Promise<any[]> => {
	if (!prisma) throw new Error("Prisma client is not available.");
	try {
		const data = await prisma.$queryRawUnsafe<any[]>(query);
		return data;
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			// @ts-ignore
			const { message } = error.meta;
			throw new Error(message);
		} else {
			throw new Error("An error occurred while fetching the data.");
		}
	}
};
