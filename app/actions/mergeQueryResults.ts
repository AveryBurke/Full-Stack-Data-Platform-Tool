// note: this is a temporary solution
// in the future the result will be stored in a database rather than returned to the client
"use server";
/**
 * 
 * @param oldResults the results to be merged with the new results
 * @param newResults the new results will over 
 * @param primaryColumn the column that is used to identify the results
 * @returns if an old result is found in the new results, the old is mutated result is returned, otherwise the new result is returned
 */
export const mergeQueryResults = async (oldResults: any, newResults: any, primaryColumn: string): Promise<any[]> => {
	const oldResultsMap = new Map(oldResults.map((result: any) => [result[primaryColumn], result]));
	const mergedResults = newResults.map((result: any) => {
		const newResult = oldResultsMap.get(result[primaryColumn]);
		if (newResult) {
			return { ...result, ...newResult };
		}
		return result;
	});
	return mergedResults;
};
