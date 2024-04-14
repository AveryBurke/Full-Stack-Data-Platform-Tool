"use server";
import prisma from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";

export const rawQuery = async (query: string):Promise<any[]> => {
	try {
		const data = await prisma.$queryRawUnsafe<any[]>(query);
		return data
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// @ts-ignore
			const { message } = error.meta;
			throw new Error(message);
		} else {
			throw new Error("An error occurred while fetching the data.");
		}
	}
};