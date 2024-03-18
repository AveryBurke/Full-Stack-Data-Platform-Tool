export const models = [
	"baseline_counts",
	"baseline_measurements",
	"brief_summaries",
	// "browse_conditions",
	// "browse_interventions",
	// "calculated_values",
	// "central_contacts",
	"conditions",
	"countries",
	"design_group_interventions",
	"design_groups",
	"design_outcomes",
	"designs",
	"detailed_descriptions",
	"drop_withdrawals",
	"eligibilities",
	// "facilities",
	// "facility_contacts",
	// "facility_investigators",
	// "id_information",
	"intervention_other_names",
	"interventions",
	// "ipd_information_types",
	"keywords",
	// "links",
	// "mesh_headings",
	// "mesh_terms",
	"milestones",
	"outcome_analyses",
	"outcome_analysis_groups",
	"outcome_counts",
	"outcome_measurements",
	"outcomes",
	// "overall_officials",
	"participant_flows",
	"pending_results",
	"provided_documents",
	"reported_event_totals",
	"reported_events",
	"responsible_parties",
	"result_agreements",
	"result_contacts",
	"result_groups",
	"retractions",
	// "search_results",
	"sponsors",
	"studies",
	// "study_references",
	// "study_searches",
] as const;
interface Message<T> {
	message: string;
	payload: T;
}
interface ErrorMessage extends Message<{error: string}>{
	message: "error";
}
interface SucesssMessage extends Message<{data:any[], query:string}>{
	message: "success";
}

declare global {
	type Model = (typeof models)[number];
	type DiscriminatedMessage = SucesssMessage | ErrorMessage;
}

export {};
