"use server";
import prisma from "../libs/prismadb";
import { Prisma } from "@prisma/client";

interface ReferingTablesInfo {
	table_name: string;
	column_name: string;
	foreign_table_name: string;
	foreign_column_name: string;
}

export async function getReferingTables(tableName: string): Promise<string> {
	try {
		const res = await prisma.$queryRawUnsafe<ReferingTablesInfo[]>(`SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
    WHERE
        constraint_type = 'FOREIGN KEY' AND ccu.table_name = '${tableName}';`);
		if (res.length > 0) {
			const referingTables = res.map((row: any) => `${row.table_name}(${row.column_name}) -> ${row.foreign_table_name}(${row.foreign_column_name})`).join("\n");
			return referingTables;
		}
		return "";
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return "An error occurred while fetching the data.";
		}
	}
}
