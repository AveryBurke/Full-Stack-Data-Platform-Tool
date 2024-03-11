import prisma from "../libs/prismadb";

/**
 * todo: exapnd this for any database. right now ctgov is hardcoded.
 * Discover the database structure.
 * @returns {Promise<any>} - The database structure.
 */
export default async function discoverDBStructure(): Promise<any> {
    const res = await prisma.$queryRaw<{table_name:string, column_name:string, data_type:string}[]>`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'ctgov' ORDER BY table_name;`;
    const headers = Object.keys(res[0]);
    const str = headers.join(",") + "\n" + res.map((row) => Object.values(row).join(",")).join("\n");
    return str;
}