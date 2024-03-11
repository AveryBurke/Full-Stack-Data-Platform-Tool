// /Users/averyburke/data_viz_aact/acct_data_viz/app/static/schemaDescription.txt
import { promises as fs } from 'fs';

export default async function Page() {
    const file = await fs.readFile(process.cwd() + '/app/static/schemaDescription.txt', 'utf8');
    return file.replace(/\s+/g, ' ');
}