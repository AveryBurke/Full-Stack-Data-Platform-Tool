'use server';
import { generateSystemPromptSuggestion } from "./generateSystemPromptSuggestion";
import { agent } from "./runAgent";
import OpenAI from "openai";

import request_data_from_db from "@/app/libs/tools/request_data_from_db.json";

/**
 * Runs a conversation with the AI model (gpt-4) to generate a request for useful data from the AACT database.
 * The conversation uses function calling to return structured data.
 * @returns the argument used in the last function call of the conversation.
 */
export const suggestionAgent = async (previous?:string | null) => {
	const systePrompt = await generateSystemPromptSuggestion();
	const tools: OpenAI.ChatCompletionTool[] = [{ type: "function", function: request_data_from_db }];
    
	const availableTools: AvailableTools = {
		request_data_from_db: (request: string) => {
			return new Promise((resolve, reject) => {
				resolve(request);
			});
		},
	};

    
	const message = await agent({
		userInput: `Please request interesting and useful data from the AACT database for me. You can request data of any type. For example, you can request data related to specific clinical trials (identified by the nct_id), interventions, conditions or study arms. Thank you!`
                + (previous ? `Your previous suggestion was ${previous}. Do not repeat yourself.` : ""),
		tools,
		availableTools,
		systePrompt,
		model: "gpt-4",
		conversationLimit: 4,
        callback: availableTools.request_data_from_db!
	});
	return message;
};
