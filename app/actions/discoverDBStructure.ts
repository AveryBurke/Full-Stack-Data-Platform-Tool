"use server";
import prisma from "../libs/prismadb";
import { models } from "../types";
import { getExampleRows } from "./getExampleRows";
import { getReferingTables } from "./getReferingTables";
import { getColumnDescriptions } from "./getColumnDescriptions";

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
	const allCalumnDescriptions = await getColumnDescriptions(tableName, schemaName);
	const firstThreeRowsSrting = await getExampleRows(tableName, 3);
	// const referingTables = await getReferingTables(tableName);
	let fristThreeRowsDescription = firstThreeRowsSrting.length > 0 ? `The first three rows of the table "${tableName}" are: \n${firstThreeRowsSrting}\n` : "";
	// let referingTablesString = referingTables.length > 0 ? `The following tables have a foreign keys which refer to the primary key in "${tableName}": \n` : "";
	return `${
		includedRows && includedConstraints && `the table "${tableName}" has the following columns and relations:\n`
	}${allCalumnDescriptions}\n${includedRows && fristThreeRowsDescription}\n`;
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
	let description = "";
	for (let i = 0; i < models.length; i++) {
		const model = models[i];
		// const tableDescription = await getAllColumnDescriptions(model, schemaName);
		const tableDescription = await getTableDescription(model, schemaName);

		description += `${i + 1}. ${model} \n ${tableDescription} \n\n`;
	}
	return description;
}