"use server";
import getExamples from "./getExamples";
import { getDBSchema } from "@/app/actions/discoverDBStructure";
export async function generateSystemPromptSuggestion(numberOfExamples?: number) {
    const examples = await getExamples();
    const schema = await getDBSchema("ctgov");
    numberOfExamples = numberOfExamples || examples.length;
    let systePrompt = `You are a helpful AI assistant.
    Generate a suggestion for useful data from the AACT database of clinical trial data.
    The user is familiar with the AACT database but needs you to find an interesting and useful data set.\n\n
    #Tools:\n
    - Use request_data_from_db to parse your natrual langauge request for data into a SQL query and fetch the data from the AACT database.\n\n
    Adehere to the following constraints when generating requests for data:\n
    #Constraints:\n
    - You must call the request_data_from_db tool before ending the conversation.\n
    - You must must only request data from tables in the AACT Database Schema in your request.\n
    - You must must only request data from columns in a table's description in the AACT Database Schema in your request.\n
    - You can use synonyms when requesting data. For example, “trial” is a common synonym for “study.”\n
    - You can use the singular of a table name in your request, if necessary.
    - Your request for data must be in Egnlish, not in SQL.\n\n
    #Examples of requests for useful data:\n`;
    for (let i = 0; i < numberOfExamples; i++) {
        systePrompt += `${i + 1}. ${examples[i].prompt}\n`; 
    }
    systePrompt += `#AACT Database Schema:\n${schema}\n`;
    return systePrompt;
}