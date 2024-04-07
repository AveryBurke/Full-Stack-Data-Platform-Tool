import { Prisma } from "@prisma/client";
import prisma from "../libs/prismadb";

interface ColumnDescription {
	column_name: string;
	data_type: string;
	is_foreign_key: boolean;
	is_primary_key: boolean;
	referenced_table_name?: string;
}

/**
 * Query the database for the description of all the columns in a table
 * @param tableName the table name
 * @param schemaName the schema name
 * @returns a description of the table
 * @example
 * 		getAllColumnDescriptions("table_name", "my_schema")
 * 		`The table 'table_name' has the following columns and relations:
 * 		column_name, data_type, key_type
 * 		column1, data_type1, none
 * 		column2, data_type2, PRIMARY KEY
 * 		column3, data_type3, FOREIGN KEY to referenced_table`
 */
export async function getColumnDescriptions(tableName: Model, schemaName: string): Promise<string> {
	const temp = `
    SELECT 
    c.column_name, 
    c.data_type,
    EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE 
        tc.table_schema = '${schemaName}' AND
        tc.table_name = '${tableName}' AND
        tc.constraint_type = 'FOREIGN KEY' AND
        kcu.column_name = c.column_name
    ) AS is_foreign_key,
    EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE 
        tc.table_schema = '${schemaName}' AND
        tc.table_name = '${tableName}' AND
        (tc.constraint_type = 'PRIMARY KEY' OR tc.constraint_type = 'UNIQUE') AND
        kcu.column_name = c.column_name
    ) AS is_primary_key,
    (
        SELECT ccu.table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE 
        tc.table_schema = '${schemaName}' AND
        tc.table_name = '${tableName}' AND
        tc.constraint_type = 'FOREIGN KEY' AND
        kcu.column_name = c.column_name
    ) AS referenced_table_name
    FROM 
    information_schema.columns c
    WHERE 
    c.table_schema = '${schemaName}' AND
    c.table_name = '${tableName}';
`;
	try {
		const columns = await prisma.$queryRawUnsafe<ColumnDescription[]>(temp);
		const columnString = columns
			.map((column) => {
				const { column_name, data_type, is_foreign_key, is_primary_key, referenced_table_name } = column;
				//there is an issue with the schema, some primary keys are listed as foreign keys. here is a temporary fix
				if (referenced_table_name && referenced_table_name === tableName) {
					return `${column_name}: ${data_type} (Primary Key)`;
				}
				return `${column_name}: ${data_type} ${is_primary_key ? "(Primary Key)" : is_foreign_key ? ` (Foreign key linked to ${referenced_table_name})` : ""}`;
			})
			.join("\n");
		return `${columnString}`;
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return e.message;
		}
		return "An error occurred while fetching the data.";
	}
}
