import { Prisma } from "@prisma/client";
import prisma from "../libs/prismadb";
import { models } from "../types";

interface ColumnDescription {
	column_name: string;
	data_type: string;
	is_foreign_key: boolean;
	is_primary_key: boolean;
	referenced_table_name?: string;
}

/**
 * query the database of a table's object id
 * @param tableName the name of the table
 * @param schemaName the name of the schema
 * @returns the postgres object id of a table
 */
async function getTableOId(tableName: string, schemaName: string): Promise<string> {
	const temp = `
    SELECT 
        c.oid,
        n.nspname,
        c.relname
    FROM pg_catalog.pg_class c
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname OPERATOR(pg_catalog.~) '^(${tableName})$' COLLATE pg_catalog.default
    AND n.nspname OPERATOR(pg_catalog.~) '^(${schemaName})$' COLLATE pg_catalog.default
    ORDER BY 2, 3;`;
	try {
		const oid = await prisma.$queryRawUnsafe<{ oid: BigInt; nspname: string; relname: string }[]>(temp);
		// const oidToAllString = { nspname: oid[0].nspname, relname: oid[0].relname, oid: oid[0].oid.toString() };
		// // console.log(oidToAllString);
		return oid[0].oid.toString();
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(e.message);
			return e.message;
		}
		throw e;
	}
}

/**
 * Query the database for the indexes of a table
 * @param oid a table's object id
 * @returns information about the indexes of a table. Most of this isn't directly usfule, but it could be useful for debugging.
 */
async function getIndexes(oid: string) {
	const temp = `
    SELECT 
        c2.relname, 
        i.indisprimary, 
        i.indisunique, 
        i.indisclustered, 
        i.indisvalid, 
        pg_catalog.pg_get_indexdef(i.indexrelid, 0, true),
        pg_catalog.pg_get_constraintdef(con.oid, true), 
        contype, 
        condeferrable, 
        condeferred, 
        i.indisreplident, 
        c2.reltablespace
    FROM 
        pg_catalog.pg_class c, 
        pg_catalog.pg_class c2, 
        pg_catalog.pg_index i
    LEFT JOIN pg_catalog.pg_constraint con ON (conrelid = i.indrelid AND conindid = i.indexrelid AND contype IN ('p','u','x'))
    WHERE c.oid = '${oid}' AND c.oid = i.indrelid AND i.indexrelid = c2.oid
    ORDER BY i.indisprimary DESC, c2.relname;

  `;
	const res = await prisma.$queryRawUnsafe<
		{
			relname: string;
			indisprimary: boolean;
			indisunique: boolean;
			indisclustered: boolean;
			indisvalid: boolean;
			pg_get_indexdef: string;
			pg_get_constraintdef?: string;
			contype?: string;
			condeferrable?: string;
			condeferred?: string;
			indisreplident: boolean;
			reltablespace: BigInt;
		}[]
	>(temp);
	return res;
}

/**
 * Query the database for the tables that reference a table
 * @param oid a table's object id
 * @returns the tables that reference a table
 */
async function getReferingTables(oid: string) {
	const temp = `
        SELECT 
            conname, 
            (SELECT relname FROM pg_catalog.pg_class WHERE oid = c.conrelid) AS ontable,
            pg_catalog.pg_get_constraintdef(oid, true) AS condef
        FROM pg_catalog.pg_constraint c
        WHERE confrelid IN (SELECT pg_catalog.pg_partition_ancestors('${oid}')
                        UNION ALL VALUES ('${oid}'::integer))
                    AND contype = 'f' AND conparentid = 0
        ORDER BY conname;
    `;
	const res = await prisma.$queryRawUnsafe<{ conname: string; ontable: string; condef: string }[]>(temp);
	return res;
}

/**
 * Query the database for the description of a table in the style of psql's \d command.
 * @param tableName the table name
 * @param schemaName the schema name
 * @returns a description of the table
 * @example
 * 		getTableDescription("table_name", "my_schema")
 * 		`The table 'table_name' has the following columns and relations:
 * 		column_name, data_type, key_type
 * 		column1, data_type1, none
 * 		column2, data_type2, PRIMARY KEY
 * 		column3, data_type3, FOREIGN KEY to referenced_table
 * 		Indexes:
 * 		Index: index_name, Definition: index_definition
 * 		Refering Tables:
 * 		Constraint: constraint_name, On Table: on_table, Definition: constraint_definition`
 */
export async function getTableDescription(tableName: Model, schemaName: string, includedRows = false, includedConstraints = false): Promise<string> {
	const allCalumnDescriptions = await getAllColumnDescriptions(tableName, schemaName);
	const oid = await getTableOId(tableName, schemaName);
	// const indexes = await getIndexes(oid);
	const referingTables = includedConstraints ? await getReferingTables(oid) : [];
	let firstFiveRowsSrting = "";
	if (includedRows) {
		const firstFiveRows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM ${tableName} LIMIT 5;`);
		if (firstFiveRows[0]) {
			firstFiveRowsSrting = `The first three rows of table "${tableName}" are: \n`;
			for (let i = 0; i < firstFiveRows.length; i++) {
				const row = firstFiveRows[i];
				const values = `${i + 1}. ${truncatedObjectValues(row, 100).join("| ")}\n`;
				firstFiveRowsSrting += values;
			}
		}
	}
	let referingTablesString = referingTables.length > 0 ? `The following tables have a foreign keys which refer to the primary key in "${tableName}": ` : "";
	for (let referingTable of referingTables) {
		const { conname, ontable, condef } = referingTable;
		const regex = /\((.*?)\)/g;
		const matches = [];
		let match;
		while ((match = regex.exec(condef))) {
			matches.push(match[1]);
		}
		referingTablesString += `\nThe field "${matches && matches[0]}" in the table "${ontable}" refers to the primary key "${
			matches && matches[1]
		}" in the table "${tableName}"`;
	}
	return allCalumnDescriptions + "\n" + firstFiveRowsSrting + "\n" + referingTablesString;
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
export async function getAllColumnDescriptions(tableName: Model, schemaName: string): Promise<string> {
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
		throw e;
	}
}
/**
 * Query the database for the description of every table in the prisma schema, in the style of psql's \d command.
 * Some tables in the databse are not in the prisma schema, so they are not included in the description.
 * This is primarily intended as a prompt for the AI to generate meaningful queries.
 * So we should consider how to make the descriptions as useful as possible for the AI.
 * @param schemaName the name of the schema
 * @returns a description of the schemaS
 * @example getDBSchema("my_schema")
 * 		`The database schema is as follows:
 * 		The table 'table_name' has the following columns and relations:
 * 		column_name, data_type, key_type
 * 		column1, data_type1, none
 * 		column2, data_type2, PRIMARY KEY
 * 		column3, data_type3, FOREIGN KEY to referenced_table
 * 		...
 * 		Indexes:
 * 		Index: index_name, Definition: index_definition
 *
 * 		Refering Tables:
 * 		Constraint: constraint_name, On Table: on_table, Definition: constraint_definition
 *
 * 		The table 'table_name_2' has the following columns and relations:
 * 		column_name, data_type, key_type
 * 		column1, data_type1, none
 * 		...`
 *
 */
export async function getDBSchema(schemaName: string) {
	let description = "The database contains the following tables and their corresponding fields: \n\n";
	for (let i = 0; i < models.length; i++) {
		const model = models[i];
		// const tableDescription = await getAllColumnDescriptions(model, schemaName);
		const tableDescription = await getTableDescription(model, schemaName);

		description += `${i + 1}. ${model} \n ${tableDescription} \n\n`;
	}
	return description;
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
			return value.slice(0, maxLength) + "...";
		}
		return value;
	});
}
