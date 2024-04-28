import { d3EasingFunctions } from "@/app/libs/visualization/easings";
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
interface ErrorMessage extends Message<{ error: string }> {
	message: "error";
}
interface SucesssMessage extends Message<{ data: any[]; query: string }> {
	message: "success";
}

type QueueTaskType = "transition" | "time" | "ease";
type Ease =
	| "easeIdentitiy"
	| "easeLinear"
	| "easeQuad"
	| "easeQuadInAndOut"
	| "easeCubic"
	| "easePoly"
	| "easeSin"
	| "easeExp"
	| "easeCircle"
	| "easeBounce"
	| "easeBack"
	| "easeElastic";
interface QueueTask<T extends QueueTaskType, P> {
	type: T;
	payload: P;
}

type TransitionQueueTask = QueueTask<"transition", Section[]>;
type TimeQueueTask = QueueTask<"time", number>;
type EaseQueueTask = QueueTask<"ease", Easing>;

declare global {
	type Easing = keyof typeof d3EasingFunctions;
	type Section = {
		id: string;
		startAngle: number;
		endAngle: number;
		innerRadius: number;
		outerRadius: number;
		fill: string;
	};
	type QueueJob = TransitionQueueTask | TimeQueueTask | EaseQueueTask;
	/**
	 * the available models in the database. Not every table is available for querying.
	 */
	type Model = (typeof models)[number];
	type DiscriminatedMessage = SucesssMessage | ErrorMessage;
	interface AgentMessage {
		type: "success" | "error";
		message: string;
	}
	/**
	 * the available tools that the AI can use.
	 */
	type Tool =
		| "get_data_from_db"
		| "get_table_description"
		| "get_uniqe_values_from_column"
		| "get_refering_tables"
		| "get_example_rows"
		| "request_data_from_db";
	type AvailableTools = { [key in Tool]?: (...args: string[]) => Promise<string> };
}

export {};
