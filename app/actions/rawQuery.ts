"use server";
import prisma from "@/app/libs/prismadb";
import { sanitize } from "@/app/libs/sanitize";

export const rawQuery = async (query: string) => {
	try {
		const data = await prisma.$queryRawUnsafe<any[]>(query);
		return data.map((d) => sanitize(d));
	} catch (error) {
		return error;
	}
};
