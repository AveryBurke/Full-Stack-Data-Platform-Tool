export const toolsDescription = 
`- get_unique_values_from_column to get a list of unique values from a specified column in a table. Use it when constructing a WHERE clause in a query.\n
- get_data_from_db to run a valid SQL query against the database and retrieve the data. Use it to validate a query by comparing the data retrieved from the database with the user's request.\n
- get_table_description to get a detailed description of the data type and constraints associated with each column in a specified table. When constructing a query use this tool to determine the available columns in the specified table and identify any foreign keys linking the table to other tables.\n
- get_refering_tables to get a list of tables linked to the specified table. If a query is invalid because a column is missing, use this function to find related tables that might contain the missing column.\n
- get_example_rows to get a description of the first five rows of a table. Use it to get an example of the kind of data in columns in the specified table. For instance, when searching for a keyword or a term, use the “ILIKE” operator and wild cards if the data appears to be a long text string.\n`
