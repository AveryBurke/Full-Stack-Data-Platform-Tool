yarn run v1.22.19
$ /Users/averyburke/data_viz_aact/acct_data_viz/node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- CreateTable
CREATE TABLE "baseline_counts" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "units" VARCHAR,
    "scope" VARCHAR,
    "count" INTEGER,

    CONSTRAINT "baseline_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baseline_measurements" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "classification" VARCHAR,
    "category" VARCHAR,
    "title" VARCHAR,
    "description" TEXT,
    "units" VARCHAR,
    "param_type" VARCHAR,
    "param_value" VARCHAR,
    "param_value_num" DECIMAL,
    "dispersion_type" VARCHAR,
    "dispersion_value" VARCHAR,
    "dispersion_value_num" DECIMAL,
    "dispersion_lower_limit" DECIMAL,
    "dispersion_upper_limit" DECIMAL,
    "explanation_of_na" VARCHAR,
    "number_analyzed" INTEGER,
    "number_analyzed_units" VARCHAR,
    "population_description" VARCHAR,
    "calculate_percentage" VARCHAR,

    CONSTRAINT "baseline_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brief_summaries" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "description" TEXT,

    CONSTRAINT "brief_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browse_conditions" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "mesh_term" VARCHAR,
    "downcase_mesh_term" VARCHAR,
    "mesh_type" VARCHAR,

    CONSTRAINT "browse_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browse_interventions" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "mesh_term" VARCHAR,
    "downcase_mesh_term" VARCHAR,
    "mesh_type" VARCHAR,

    CONSTRAINT "browse_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculated_values" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "number_of_facilities" INTEGER,
    "number_of_nsae_subjects" INTEGER,
    "number_of_sae_subjects" INTEGER,
    "registered_in_calendar_year" INTEGER,
    "nlm_download_date" DATE,
    "actual_duration" INTEGER,
    "were_results_reported" BOOLEAN DEFAULT false,
    "months_to_report_results" INTEGER,
    "has_us_facility" BOOLEAN,
    "has_single_facility" BOOLEAN DEFAULT false,
    "minimum_age_num" INTEGER,
    "maximum_age_num" INTEGER,
    "minimum_age_unit" VARCHAR,
    "maximum_age_unit" VARCHAR,
    "number_of_primary_outcomes_to_measure" INTEGER,
    "number_of_secondary_outcomes_to_measure" INTEGER,
    "number_of_other_outcomes_to_measure" INTEGER,

    CONSTRAINT "calculated_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "central_contacts" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "contact_type" VARCHAR,
    "name" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "phone_extension" VARCHAR,
    "role" VARCHAR,

    CONSTRAINT "central_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conditions" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "name" VARCHAR,
    "downcase_name" VARCHAR,

    CONSTRAINT "conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "name" VARCHAR,
    "removed" BOOLEAN,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_group_interventions" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "design_group_id" INTEGER,
    "intervention_id" INTEGER,

    CONSTRAINT "design_group_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_groups" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "group_type" VARCHAR,
    "title" VARCHAR,
    "description" TEXT,

    CONSTRAINT "design_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_outcomes" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "outcome_type" VARCHAR,
    "measure" TEXT,
    "time_frame" TEXT,
    "population" VARCHAR,
    "description" TEXT,

    CONSTRAINT "design_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designs" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "allocation" VARCHAR,
    "intervention_model" VARCHAR,
    "observational_model" VARCHAR,
    "primary_purpose" VARCHAR,
    "time_perspective" VARCHAR,
    "masking" VARCHAR,
    "masking_description" TEXT,
    "intervention_model_description" TEXT,
    "subject_masked" BOOLEAN,
    "caregiver_masked" BOOLEAN,
    "investigator_masked" BOOLEAN,
    "outcomes_assessor_masked" BOOLEAN,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailed_descriptions" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "description" TEXT,

    CONSTRAINT "detailed_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "document_id" VARCHAR,
    "document_type" VARCHAR,
    "url" VARCHAR,
    "comment" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drop_withdrawals" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "period" VARCHAR,
    "reason" VARCHAR,
    "count" INTEGER,
    "drop_withdraw_comment" VARCHAR,
    "reason_comment" VARCHAR,
    "count_units" INTEGER,

    CONSTRAINT "drop_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eligibilities" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "sampling_method" VARCHAR,
    "gender" VARCHAR,
    "minimum_age" VARCHAR,
    "maximum_age" VARCHAR,
    "healthy_volunteers" VARCHAR,
    "population" TEXT,
    "criteria" TEXT,
    "gender_description" TEXT,
    "gender_based" BOOLEAN,
    "adult" BOOLEAN,
    "child" BOOLEAN,
    "older_adult" BOOLEAN,

    CONSTRAINT "eligibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "status" VARCHAR,
    "name" VARCHAR,
    "city" VARCHAR,
    "state" VARCHAR,
    "zip" VARCHAR,
    "country" VARCHAR,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_contacts" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "facility_id" INTEGER,
    "contact_type" VARCHAR,
    "name" VARCHAR,
    "email" VARCHAR,
    "phone" VARCHAR,
    "phone_extension" VARCHAR,

    CONSTRAINT "facility_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_investigators" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "facility_id" INTEGER,
    "role" VARCHAR,
    "name" VARCHAR,

    CONSTRAINT "facility_investigators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "id_information" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "id_source" VARCHAR,
    "id_value" VARCHAR,
    "id_type" VARCHAR,
    "id_type_description" VARCHAR,
    "id_link" VARCHAR,

    CONSTRAINT "id_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention_other_names" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "intervention_id" INTEGER,
    "name" VARCHAR,

    CONSTRAINT "intervention_other_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "intervention_type" VARCHAR,
    "name" VARCHAR,
    "description" TEXT,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ipd_information_types" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "name" VARCHAR,

    CONSTRAINT "ipd_information_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "name" VARCHAR,
    "downcase_name" VARCHAR,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "url" VARCHAR,
    "description" TEXT,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_headings" (
    "id" SERIAL NOT NULL,
    "qualifier" VARCHAR,
    "heading" VARCHAR,
    "subcategory" VARCHAR,

    CONSTRAINT "mesh_headings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_terms" (
    "id" SERIAL NOT NULL,
    "qualifier" VARCHAR,
    "tree_number" VARCHAR,
    "description" VARCHAR,
    "mesh_term" VARCHAR,
    "downcase_mesh_term" VARCHAR,

    CONSTRAINT "mesh_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "title" VARCHAR,
    "period" VARCHAR,
    "description" TEXT,
    "count" INTEGER,
    "milestone_description" VARCHAR,
    "count_units" VARCHAR,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcome_analyses" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "outcome_id" INTEGER,
    "non_inferiority_type" VARCHAR,
    "non_inferiority_description" TEXT,
    "param_type" VARCHAR,
    "param_value" DECIMAL,
    "dispersion_type" VARCHAR,
    "dispersion_value" DECIMAL,
    "p_value_modifier" VARCHAR,
    "p_value" DOUBLE PRECISION,
    "ci_n_sides" VARCHAR,
    "ci_percent" DECIMAL,
    "ci_lower_limit" DECIMAL,
    "ci_upper_limit" DECIMAL,
    "ci_upper_limit_na_comment" VARCHAR,
    "p_value_description" VARCHAR,
    "method" VARCHAR,
    "method_description" TEXT,
    "estimate_description" TEXT,
    "groups_description" TEXT,
    "other_analysis_description" TEXT,
    "ci_upper_limit_raw" VARCHAR,
    "ci_lower_limit_raw" VARCHAR,
    "p_value_raw" VARCHAR,

    CONSTRAINT "outcome_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcome_analysis_groups" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "outcome_analysis_id" INTEGER,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,

    CONSTRAINT "outcome_analysis_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcome_counts" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "outcome_id" INTEGER,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "scope" VARCHAR,
    "units" VARCHAR,
    "count" INTEGER,

    CONSTRAINT "outcome_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcome_measurements" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "outcome_id" INTEGER,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "classification" VARCHAR,
    "category" VARCHAR,
    "title" VARCHAR,
    "description" TEXT,
    "units" VARCHAR,
    "param_type" VARCHAR,
    "param_value" VARCHAR,
    "param_value_num" DECIMAL,
    "dispersion_type" VARCHAR,
    "dispersion_value" VARCHAR,
    "dispersion_value_num" DECIMAL,
    "dispersion_lower_limit" DECIMAL,
    "dispersion_upper_limit" DECIMAL,
    "explanation_of_na" TEXT,
    "dispersion_upper_limit_raw" VARCHAR,
    "dispersion_lower_limit_raw" VARCHAR,

    CONSTRAINT "outcome_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcomes" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "outcome_type" VARCHAR,
    "title" TEXT,
    "description" TEXT,
    "time_frame" TEXT,
    "population" TEXT,
    "anticipated_posting_date" DATE,
    "anticipated_posting_month_year" VARCHAR,
    "units" VARCHAR,
    "units_analyzed" VARCHAR,
    "dispersion_type" VARCHAR,
    "param_type" VARCHAR,

    CONSTRAINT "outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overall_officials" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "role" VARCHAR,
    "name" VARCHAR,
    "affiliation" VARCHAR,

    CONSTRAINT "overall_officials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant_flows" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "recruitment_details" TEXT,
    "pre_assignment_details" TEXT,
    "units_analyzed" VARCHAR,
    "drop_withdraw_comment" VARCHAR,
    "reason_comment" VARCHAR,
    "count_units" INTEGER,

    CONSTRAINT "participant_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_results" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "event" VARCHAR,
    "event_date_description" VARCHAR,
    "event_date" DATE,

    CONSTRAINT "pending_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provided_documents" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "document_type" VARCHAR,
    "has_protocol" BOOLEAN,
    "has_icf" BOOLEAN,
    "has_sap" BOOLEAN,
    "document_date" DATE,
    "url" VARCHAR,

    CONSTRAINT "provided_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reported_event_totals" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR NOT NULL,
    "ctgov_group_code" VARCHAR NOT NULL,
    "event_type" VARCHAR,
    "classification" VARCHAR NOT NULL,
    "subjects_affected" INTEGER,
    "subjects_at_risk" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "reported_event_totals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reported_events" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "result_group_id" INTEGER,
    "ctgov_group_code" VARCHAR,
    "time_frame" TEXT,
    "event_type" VARCHAR,
    "default_vocab" VARCHAR,
    "default_assessment" VARCHAR,
    "subjects_affected" INTEGER,
    "subjects_at_risk" INTEGER,
    "description" TEXT,
    "event_count" INTEGER,
    "organ_system" VARCHAR,
    "adverse_event_term" VARCHAR,
    "frequency_threshold" INTEGER,
    "vocab" VARCHAR,
    "assessment" VARCHAR,

    CONSTRAINT "reported_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsible_parties" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "responsible_party_type" VARCHAR,
    "name" VARCHAR,
    "title" VARCHAR,
    "organization" VARCHAR,
    "affiliation" TEXT,
    "old_name_title" VARCHAR,

    CONSTRAINT "responsible_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_agreements" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "pi_employee" VARCHAR,
    "agreement" TEXT,
    "restriction_type" VARCHAR,
    "other_details" TEXT,
    "restrictive_agreement" VARCHAR,

    CONSTRAINT "result_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_contacts" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "organization" VARCHAR,
    "name" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "extension" VARCHAR,

    CONSTRAINT "result_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_groups" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "ctgov_group_code" VARCHAR,
    "result_type" VARCHAR,
    "title" VARCHAR,
    "description" TEXT,

    CONSTRAINT "result_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retractions" (
    "id" BIGSERIAL NOT NULL,
    "reference_id" INTEGER,
    "pmid" VARCHAR,
    "source" VARCHAR,
    "nct_id" VARCHAR,

    CONSTRAINT "retractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_results" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "grouping" VARCHAR NOT NULL DEFAULT '',
    "study_search_id" INTEGER,

    CONSTRAINT "search_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "agency_class" VARCHAR,
    "lead_or_collaborator" VARCHAR,
    "name" VARCHAR,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studies" (
    "nct_id" VARCHAR,
    "nlm_download_date_description" VARCHAR,
    "study_first_submitted_date" DATE,
    "results_first_submitted_date" DATE,
    "disposition_first_submitted_date" DATE,
    "last_update_submitted_date" DATE,
    "study_first_submitted_qc_date" DATE,
    "study_first_posted_date" DATE,
    "study_first_posted_date_type" VARCHAR,
    "results_first_submitted_qc_date" DATE,
    "results_first_posted_date" DATE,
    "results_first_posted_date_type" VARCHAR,
    "disposition_first_submitted_qc_date" DATE,
    "disposition_first_posted_date" DATE,
    "disposition_first_posted_date_type" VARCHAR,
    "last_update_submitted_qc_date" DATE,
    "last_update_posted_date" DATE,
    "last_update_posted_date_type" VARCHAR,
    "start_month_year" VARCHAR,
    "start_date_type" VARCHAR,
    "start_date" DATE,
    "verification_month_year" VARCHAR,
    "verification_date" DATE,
    "completion_month_year" VARCHAR,
    "completion_date_type" VARCHAR,
    "completion_date" DATE,
    "primary_completion_month_year" VARCHAR,
    "primary_completion_date_type" VARCHAR,
    "primary_completion_date" DATE,
    "target_duration" VARCHAR,
    "study_type" VARCHAR,
    "acronym" VARCHAR,
    "baseline_population" TEXT,
    "brief_title" TEXT,
    "official_title" TEXT,
    "overall_status" VARCHAR,
    "last_known_status" VARCHAR,
    "phase" VARCHAR,
    "enrollment" INTEGER,
    "enrollment_type" VARCHAR,
    "source" VARCHAR,
    "limitations_and_caveats" VARCHAR,
    "number_of_arms" INTEGER,
    "number_of_groups" INTEGER,
    "why_stopped" VARCHAR,
    "has_expanded_access" BOOLEAN,
    "expanded_access_type_individual" BOOLEAN,
    "expanded_access_type_intermediate" BOOLEAN,
    "expanded_access_type_treatment" BOOLEAN,
    "has_dmc" BOOLEAN,
    "is_fda_regulated_drug" BOOLEAN,
    "is_fda_regulated_device" BOOLEAN,
    "is_unapproved_device" BOOLEAN,
    "is_ppsd" BOOLEAN,
    "is_us_export" BOOLEAN,
    "biospec_retention" VARCHAR,
    "biospec_description" TEXT,
    "ipd_time_frame" VARCHAR,
    "ipd_access_criteria" VARCHAR,
    "ipd_url" VARCHAR,
    "plan_to_share_ipd" VARCHAR,
    "plan_to_share_ipd_description" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "source_class" VARCHAR,
    "delayed_posting" VARCHAR,
    "expanded_access_nctid" VARCHAR,
    "expanded_access_status_for_nctid" VARCHAR,
    "fdaaa801_violation" BOOLEAN,
    "baseline_type_units_analyzed" VARCHAR
);

-- CreateTable
CREATE TABLE "study_references" (
    "id" SERIAL NOT NULL,
    "nct_id" VARCHAR,
    "pmid" VARCHAR,
    "reference_type" VARCHAR,
    "citation" TEXT,

    CONSTRAINT "study_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_searches" (
    "id" SERIAL NOT NULL,
    "save_tsv" BOOLEAN NOT NULL DEFAULT false,
    "query" VARCHAR NOT NULL,
    "grouping" VARCHAR NOT NULL DEFAULT '',
    "name" VARCHAR NOT NULL DEFAULT '',
    "beta_api" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "study_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "baseline_counts_nct_idx" ON "baseline_counts"("nct_id");

-- CreateIndex
CREATE INDEX "index_baseline_counts_on_nct_id" ON "baseline_counts"("nct_id");

-- CreateIndex
CREATE INDEX "baseline_measurements_nct_idx" ON "baseline_measurements"("nct_id");

-- CreateIndex
CREATE INDEX "index_baseline_measurements_on_category" ON "baseline_measurements"("category");

-- CreateIndex
CREATE INDEX "index_baseline_measurements_on_classification" ON "baseline_measurements"("classification");

-- CreateIndex
CREATE INDEX "index_baseline_measurements_on_dispersion_type" ON "baseline_measurements"("dispersion_type");

-- CreateIndex
CREATE INDEX "index_baseline_measurements_on_nct_id" ON "baseline_measurements"("nct_id");

-- CreateIndex
CREATE INDEX "index_baseline_measurements_on_param_type" ON "baseline_measurements"("param_type");

-- CreateIndex
CREATE UNIQUE INDEX "index_brief_summaries_on_nct_id" ON "brief_summaries"("nct_id");

-- CreateIndex
CREATE INDEX "brief_summaries_nct_idx" ON "brief_summaries"("nct_id");

-- CreateIndex
CREATE INDEX "browse_conditions_nct_idx" ON "browse_conditions"("nct_id");

-- CreateIndex
CREATE INDEX "index_browse_conditions_on_downcase_mesh_term" ON "browse_conditions"("downcase_mesh_term");

-- CreateIndex
CREATE INDEX "index_browse_conditions_on_mesh_term" ON "browse_conditions"("mesh_term");

-- CreateIndex
CREATE INDEX "index_browse_conditions_on_nct_id" ON "browse_conditions"("nct_id");

-- CreateIndex
CREATE INDEX "browse_interventions_nct_idx" ON "browse_interventions"("nct_id");

-- CreateIndex
CREATE INDEX "index_browse_interventions_on_downcase_mesh_term" ON "browse_interventions"("downcase_mesh_term");

-- CreateIndex
CREATE INDEX "index_browse_interventions_on_mesh_term" ON "browse_interventions"("mesh_term");

-- CreateIndex
CREATE INDEX "index_browse_interventions_on_nct_id" ON "browse_interventions"("nct_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_calculated_values_on_nct_id" ON "calculated_values"("nct_id");

-- CreateIndex
CREATE INDEX "calculated_values_nct_idx" ON "calculated_values"("nct_id");

-- CreateIndex
CREATE INDEX "index_calculated_values_on_actual_duration" ON "calculated_values"("actual_duration");

-- CreateIndex
CREATE INDEX "index_calculated_values_on_months_to_report_results" ON "calculated_values"("months_to_report_results");

-- CreateIndex
CREATE INDEX "index_calculated_values_on_number_of_facilities" ON "calculated_values"("number_of_facilities");

-- CreateIndex
CREATE INDEX "central_contacts_nct_idx" ON "central_contacts"("nct_id");

-- CreateIndex
CREATE INDEX "index_central_contacts_on_contact_type" ON "central_contacts"("contact_type");

-- CreateIndex
CREATE INDEX "index_central_contacts_on_nct_id" ON "central_contacts"("nct_id");

-- CreateIndex
CREATE INDEX "conditions_nct_idx" ON "conditions"("nct_id");

-- CreateIndex
CREATE INDEX "index_conditions_on_downcase_name" ON "conditions"("downcase_name");

-- CreateIndex
CREATE INDEX "index_conditions_on_name" ON "conditions"("name");

-- CreateIndex
CREATE INDEX "index_conditions_on_nct_id" ON "conditions"("nct_id");

-- CreateIndex
CREATE INDEX "countries_nct_idx" ON "countries"("nct_id");

-- CreateIndex
CREATE INDEX "index_countries_on_nct_id" ON "countries"("nct_id");

-- CreateIndex
CREATE INDEX "design_group_interventions_nct_idx" ON "design_group_interventions"("nct_id");

-- CreateIndex
CREATE INDEX "index_design_group_interventions_on_design_group_id" ON "design_group_interventions"("design_group_id");

-- CreateIndex
CREATE INDEX "index_design_group_interventions_on_intervention_id" ON "design_group_interventions"("intervention_id");

-- CreateIndex
CREATE INDEX "index_design_group_interventions_on_nct_id" ON "design_group_interventions"("nct_id");

-- CreateIndex
CREATE INDEX "design_groups_nct_idx" ON "design_groups"("nct_id");

-- CreateIndex
CREATE INDEX "index_design_groups_on_group_type" ON "design_groups"("group_type");

-- CreateIndex
CREATE INDEX "index_design_groups_on_nct_id" ON "design_groups"("nct_id");

-- CreateIndex
CREATE INDEX "design_outcomes_nct_idx" ON "design_outcomes"("nct_id");

-- CreateIndex
CREATE INDEX "index_design_outcomes_on_measure" ON "design_outcomes"("measure");

-- CreateIndex
CREATE INDEX "index_design_outcomes_on_nct_id" ON "design_outcomes"("nct_id");

-- CreateIndex
CREATE INDEX "index_design_outcomes_on_outcome_type" ON "design_outcomes"("outcome_type");

-- CreateIndex
CREATE UNIQUE INDEX "index_designs_on_nct_id" ON "designs"("nct_id");

-- CreateIndex
CREATE INDEX "designs_nct_idx" ON "designs"("nct_id");

-- CreateIndex
CREATE INDEX "index_designs_on_caregiver_masked" ON "designs"("caregiver_masked");

-- CreateIndex
CREATE INDEX "index_designs_on_investigator_masked" ON "designs"("investigator_masked");

-- CreateIndex
CREATE INDEX "index_designs_on_masking" ON "designs"("masking");

-- CreateIndex
CREATE INDEX "index_designs_on_outcomes_assessor_masked" ON "designs"("outcomes_assessor_masked");

-- CreateIndex
CREATE INDEX "index_designs_on_subject_masked" ON "designs"("subject_masked");

-- CreateIndex
CREATE UNIQUE INDEX "index_detailed_descriptions_on_nct_id" ON "detailed_descriptions"("nct_id");

-- CreateIndex
CREATE INDEX "detailed_descriptions_nct_idx" ON "detailed_descriptions"("nct_id");

-- CreateIndex
CREATE INDEX "documents_nct_idx" ON "documents"("nct_id");

-- CreateIndex
CREATE INDEX "index_documents_on_document_id" ON "documents"("document_id");

-- CreateIndex
CREATE INDEX "index_documents_on_document_type" ON "documents"("document_type");

-- CreateIndex
CREATE INDEX "index_documents_on_nct_id" ON "documents"("nct_id");

-- CreateIndex
CREATE INDEX "drop_withdrawals_nct_idx" ON "drop_withdrawals"("nct_id");

-- CreateIndex
CREATE INDEX "index_drop_withdrawals_on_nct_id" ON "drop_withdrawals"("nct_id");

-- CreateIndex
CREATE INDEX "index_drop_withdrawals_on_period" ON "drop_withdrawals"("period");

-- CreateIndex
CREATE UNIQUE INDEX "index_eligibilities_on_nct_id" ON "eligibilities"("nct_id");

-- CreateIndex
CREATE INDEX "eligibilities_nct_idx" ON "eligibilities"("nct_id");

-- CreateIndex
CREATE INDEX "index_eligibilities_on_gender" ON "eligibilities"("gender");

-- CreateIndex
CREATE INDEX "index_eligibilities_on_healthy_volunteers" ON "eligibilities"("healthy_volunteers");

-- CreateIndex
CREATE INDEX "index_eligibilities_on_maximum_age" ON "eligibilities"("maximum_age");

-- CreateIndex
CREATE INDEX "index_eligibilities_on_minimum_age" ON "eligibilities"("minimum_age");

-- CreateIndex
CREATE INDEX "facilities_nct_idx" ON "facilities"("nct_id");

-- CreateIndex
CREATE INDEX "index_facilities_on_city" ON "facilities"("city");

-- CreateIndex
CREATE INDEX "index_facilities_on_country" ON "facilities"("country");

-- CreateIndex
CREATE INDEX "index_facilities_on_name" ON "facilities"("name");

-- CreateIndex
CREATE INDEX "index_facilities_on_nct_id" ON "facilities"("nct_id");

-- CreateIndex
CREATE INDEX "index_facilities_on_state" ON "facilities"("state");

-- CreateIndex
CREATE INDEX "index_facilities_on_status" ON "facilities"("status");

-- CreateIndex
CREATE INDEX "facility_contacts_nct_idx" ON "facility_contacts"("nct_id");

-- CreateIndex
CREATE INDEX "index_facility_contacts_on_contact_type" ON "facility_contacts"("contact_type");

-- CreateIndex
CREATE INDEX "index_facility_contacts_on_nct_id" ON "facility_contacts"("nct_id");

-- CreateIndex
CREATE INDEX "facility_investigators_nct_idx" ON "facility_investigators"("nct_id");

-- CreateIndex
CREATE INDEX "index_facility_investigators_on_nct_id" ON "facility_investigators"("nct_id");

-- CreateIndex
CREATE INDEX "id_information_nct_idx" ON "id_information"("nct_id");

-- CreateIndex
CREATE INDEX "index_id_information_on_id_type" ON "id_information"("id_type");

-- CreateIndex
CREATE INDEX "index_id_information_on_nct_id" ON "id_information"("nct_id");

-- CreateIndex
CREATE INDEX "index_intervention_other_names_on_nct_id" ON "intervention_other_names"("nct_id");

-- CreateIndex
CREATE INDEX "intervention_other_names_nct_idx" ON "intervention_other_names"("nct_id");

-- CreateIndex
CREATE INDEX "index_interventions_on_intervention_type" ON "interventions"("intervention_type");

-- CreateIndex
CREATE INDEX "index_interventions_on_nct_id" ON "interventions"("nct_id");

-- CreateIndex
CREATE INDEX "interventions_nct_idx" ON "interventions"("nct_id");

-- CreateIndex
CREATE INDEX "index_ipd_information_types_on_nct_id" ON "ipd_information_types"("nct_id");

-- CreateIndex
CREATE INDEX "ipd_information_types_nct_idx" ON "ipd_information_types"("nct_id");

-- CreateIndex
CREATE INDEX "index_keywords_on_downcase_name" ON "keywords"("downcase_name");

-- CreateIndex
CREATE INDEX "index_keywords_on_name" ON "keywords"("name");

-- CreateIndex
CREATE INDEX "index_keywords_on_nct_id" ON "keywords"("nct_id");

-- CreateIndex
CREATE INDEX "keywords_nct_idx" ON "keywords"("nct_id");

-- CreateIndex
CREATE INDEX "index_links_on_nct_id" ON "links"("nct_id");

-- CreateIndex
CREATE INDEX "links_nct_idx" ON "links"("nct_id");

-- CreateIndex
CREATE INDEX "index_mesh_headings_on_qualifier" ON "mesh_headings"("qualifier");

-- CreateIndex
CREATE INDEX "index_mesh_terms_on_description" ON "mesh_terms"("description");

-- CreateIndex
CREATE INDEX "index_mesh_terms_on_downcase_mesh_term" ON "mesh_terms"("downcase_mesh_term");

-- CreateIndex
CREATE INDEX "index_mesh_terms_on_mesh_term" ON "mesh_terms"("mesh_term");

-- CreateIndex
CREATE INDEX "index_mesh_terms_on_qualifier" ON "mesh_terms"("qualifier");

-- CreateIndex
CREATE INDEX "index_milestones_on_nct_id" ON "milestones"("nct_id");

-- CreateIndex
CREATE INDEX "index_milestones_on_period" ON "milestones"("period");

-- CreateIndex
CREATE INDEX "milestones_nct_idx" ON "milestones"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcome_analyses_on_dispersion_type" ON "outcome_analyses"("dispersion_type");

-- CreateIndex
CREATE INDEX "index_outcome_analyses_on_nct_id" ON "outcome_analyses"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcome_analyses_on_param_type" ON "outcome_analyses"("param_type");

-- CreateIndex
CREATE INDEX "outcome_analyses_nct_idx" ON "outcome_analyses"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcome_analysis_groups_on_nct_id" ON "outcome_analysis_groups"("nct_id");

-- CreateIndex
CREATE INDEX "outcome_analysis_groups_nct_idx" ON "outcome_analysis_groups"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcome_counts_on_nct_id" ON "outcome_counts"("nct_id");

-- CreateIndex
CREATE INDEX "outcome_counts_nct_idx" ON "outcome_counts"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcome_measurements_on_category" ON "outcome_measurements"("category");

-- CreateIndex
CREATE INDEX "index_outcome_measurements_on_classification" ON "outcome_measurements"("classification");

-- CreateIndex
CREATE INDEX "index_outcome_measurements_on_dispersion_type" ON "outcome_measurements"("dispersion_type");

-- CreateIndex
CREATE INDEX "index_outcome_measurements_on_nct_id" ON "outcome_measurements"("nct_id");

-- CreateIndex
CREATE INDEX "outcome_measurements_nct_idx" ON "outcome_measurements"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcomes_on_dispersion_type" ON "outcomes"("dispersion_type");

-- CreateIndex
CREATE INDEX "index_outcomes_on_nct_id" ON "outcomes"("nct_id");

-- CreateIndex
CREATE INDEX "index_outcomes_on_param_type" ON "outcomes"("param_type");

-- CreateIndex
CREATE INDEX "outcomes_nct_idx" ON "outcomes"("nct_id");

-- CreateIndex
CREATE INDEX "index_overall_officials_on_affiliation" ON "overall_officials"("affiliation");

-- CreateIndex
CREATE INDEX "index_overall_officials_on_nct_id" ON "overall_officials"("nct_id");

-- CreateIndex
CREATE INDEX "overall_officials_nct_idx" ON "overall_officials"("nct_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_participant_flows_on_nct_id" ON "participant_flows"("nct_id");

-- CreateIndex
CREATE INDEX "participant_flows_nct_idx" ON "participant_flows"("nct_id");

-- CreateIndex
CREATE INDEX "index_pending_results_on_nct_id" ON "pending_results"("nct_id");

-- CreateIndex
CREATE INDEX "pending_results_nct_idx" ON "pending_results"("nct_id");

-- CreateIndex
CREATE INDEX "index_provided_documents_on_nct_id" ON "provided_documents"("nct_id");

-- CreateIndex
CREATE INDEX "provided_documents_nct_idx" ON "provided_documents"("nct_id");

-- CreateIndex
CREATE INDEX "index_reported_event_totals_on_nct_id" ON "reported_event_totals"("nct_id");

-- CreateIndex
CREATE INDEX "reported_event_totals_nct_idx" ON "reported_event_totals"("nct_id");

-- CreateIndex
CREATE INDEX "index_reported_events_on_event_type" ON "reported_events"("event_type");

-- CreateIndex
CREATE INDEX "index_reported_events_on_nct_id" ON "reported_events"("nct_id");

-- CreateIndex
CREATE INDEX "index_reported_events_on_subjects_affected" ON "reported_events"("subjects_affected");

-- CreateIndex
CREATE INDEX "reported_events_nct_idx" ON "reported_events"("nct_id");

-- CreateIndex
CREATE INDEX "index_responsible_parties_on_nct_id" ON "responsible_parties"("nct_id");

-- CreateIndex
CREATE INDEX "index_responsible_parties_on_organization" ON "responsible_parties"("organization");

-- CreateIndex
CREATE INDEX "index_responsible_parties_on_responsible_party_type" ON "responsible_parties"("responsible_party_type");

-- CreateIndex
CREATE INDEX "responsible_parties_nct_idx" ON "responsible_parties"("nct_id");

-- CreateIndex
CREATE INDEX "index_result_agreements_on_nct_id" ON "result_agreements"("nct_id");

-- CreateIndex
CREATE INDEX "result_agreements_nct_idx" ON "result_agreements"("nct_id");

-- CreateIndex
CREATE INDEX "index_result_contacts_on_nct_id" ON "result_contacts"("nct_id");

-- CreateIndex
CREATE INDEX "index_result_contacts_on_organization" ON "result_contacts"("organization");

-- CreateIndex
CREATE INDEX "result_contacts_nct_idx" ON "result_contacts"("nct_id");

-- CreateIndex
CREATE INDEX "index_result_groups_on_nct_id" ON "result_groups"("nct_id");

-- CreateIndex
CREATE INDEX "index_result_groups_on_result_type" ON "result_groups"("result_type");

-- CreateIndex
CREATE INDEX "result_groups_nct_idx" ON "result_groups"("nct_id");

-- CreateIndex
CREATE INDEX "index_retractions_on_nct_id" ON "retractions"("nct_id");

-- CreateIndex
CREATE INDEX "categories_nct_idx" ON "search_results"("nct_id");

-- CreateIndex
CREATE INDEX "index_search_results_on_nct_id" ON "search_results"("nct_id");

-- CreateIndex
CREATE INDEX "index_sponsors_on_agency_class" ON "sponsors"("agency_class");

-- CreateIndex
CREATE INDEX "index_sponsors_on_name" ON "sponsors"("name");

-- CreateIndex
CREATE INDEX "index_sponsors_on_nct_id" ON "sponsors"("nct_id");

-- CreateIndex
CREATE INDEX "sponsors_nct_idx" ON "sponsors"("nct_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_studies_on_nct_id" ON "studies"("nct_id");

-- CreateIndex
CREATE INDEX "index_studies_on_disposition_first_submitted_date" ON "studies"("disposition_first_submitted_date");

-- CreateIndex
CREATE INDEX "index_studies_on_enrollment_type" ON "studies"("enrollment_type");

-- CreateIndex
CREATE INDEX "index_studies_on_last_known_status" ON "studies"("last_known_status");

-- CreateIndex
CREATE INDEX "index_studies_on_last_update_submitted_date" ON "studies"("last_update_submitted_date");

-- CreateIndex
CREATE INDEX "index_studies_on_last_update_submitted_qc_date" ON "studies"("last_update_submitted_qc_date");

-- CreateIndex
CREATE INDEX "index_studies_on_overall_status" ON "studies"("overall_status");

-- CreateIndex
CREATE INDEX "index_studies_on_phase" ON "studies"("phase");

-- CreateIndex
CREATE INDEX "index_studies_on_primary_completion_date_type" ON "studies"("primary_completion_date_type");

-- CreateIndex
CREATE INDEX "index_studies_on_results_first_submitted_date" ON "studies"("results_first_submitted_date");

-- CreateIndex
CREATE INDEX "index_studies_on_results_first_submitted_qc_date" ON "studies"("results_first_submitted_qc_date");

-- CreateIndex
CREATE INDEX "index_studies_on_source" ON "studies"("source");

-- CreateIndex
CREATE INDEX "index_studies_on_study_first_submitted_date" ON "studies"("study_first_submitted_date");

-- CreateIndex
CREATE INDEX "index_studies_on_study_first_submitted_qc_date" ON "studies"("study_first_submitted_qc_date");

-- CreateIndex
CREATE INDEX "index_studies_on_study_type" ON "studies"("study_type");

-- CreateIndex
CREATE INDEX "studies_nct_idx" ON "studies"("nct_id");

-- CreateIndex
CREATE INDEX "index_study_references_on_nct_id" ON "study_references"("nct_id");

-- CreateIndex
CREATE INDEX "index_study_references_on_pmid" ON "study_references"("pmid");

-- CreateIndex
CREATE INDEX "index_study_references_on_reference_type" ON "study_references"("reference_type");

-- CreateIndex
CREATE INDEX "study_references_nct_idx" ON "study_references"("nct_id");

-- AddForeignKey
ALTER TABLE "baseline_counts" ADD CONSTRAINT "baseline_counts_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "baseline_counts" ADD CONSTRAINT "baseline_counts_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "baseline_measurements" ADD CONSTRAINT "baseline_measurements_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "baseline_measurements" ADD CONSTRAINT "baseline_measurements_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brief_summaries" ADD CONSTRAINT "brief_summaries_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "browse_conditions" ADD CONSTRAINT "browse_conditions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "browse_interventions" ADD CONSTRAINT "browse_interventions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calculated_values" ADD CONSTRAINT "calculated_values_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "central_contacts" ADD CONSTRAINT "central_contacts_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "design_group_interventions" ADD CONSTRAINT "design_group_interventions_design_group_id_fkey" FOREIGN KEY ("design_group_id") REFERENCES "design_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "design_group_interventions" ADD CONSTRAINT "design_group_interventions_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "design_group_interventions" ADD CONSTRAINT "design_group_interventions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "design_groups" ADD CONSTRAINT "design_groups_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "design_outcomes" ADD CONSTRAINT "design_outcomes_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detailed_descriptions" ADD CONSTRAINT "detailed_descriptions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "drop_withdrawals" ADD CONSTRAINT "drop_withdrawals_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "drop_withdrawals" ADD CONSTRAINT "drop_withdrawals_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eligibilities" ADD CONSTRAINT "eligibilities_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facility_contacts" ADD CONSTRAINT "facility_contacts_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facility_contacts" ADD CONSTRAINT "facility_contacts_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facility_investigators" ADD CONSTRAINT "facility_investigators_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facility_investigators" ADD CONSTRAINT "facility_investigators_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "id_information" ADD CONSTRAINT "id_information_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intervention_other_names" ADD CONSTRAINT "intervention_other_names_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intervention_other_names" ADD CONSTRAINT "intervention_other_names_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ipd_information_types" ADD CONSTRAINT "ipd_information_types_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "keywords" ADD CONSTRAINT "keywords_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_analyses" ADD CONSTRAINT "outcome_analyses_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_analyses" ADD CONSTRAINT "outcome_analyses_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_analysis_groups" ADD CONSTRAINT "outcome_analysis_groups_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_analysis_groups" ADD CONSTRAINT "outcome_analysis_groups_outcome_analysis_id_fkey" FOREIGN KEY ("outcome_analysis_id") REFERENCES "outcome_analyses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_analysis_groups" ADD CONSTRAINT "outcome_analysis_groups_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_counts" ADD CONSTRAINT "outcome_counts_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_counts" ADD CONSTRAINT "outcome_counts_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_counts" ADD CONSTRAINT "outcome_counts_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_measurements" ADD CONSTRAINT "outcome_measurements_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_measurements" ADD CONSTRAINT "outcome_measurements_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcome_measurements" ADD CONSTRAINT "outcome_measurements_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "overall_officials" ADD CONSTRAINT "overall_officials_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participant_flows" ADD CONSTRAINT "participant_flows_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pending_results" ADD CONSTRAINT "pending_results_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "provided_documents" ADD CONSTRAINT "provided_documents_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reported_event_totals" ADD CONSTRAINT "reported_event_totals_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reported_events" ADD CONSTRAINT "reported_events_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reported_events" ADD CONSTRAINT "reported_events_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "responsible_parties" ADD CONSTRAINT "responsible_parties_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result_agreements" ADD CONSTRAINT "result_agreements_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result_contacts" ADD CONSTRAINT "result_contacts_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result_groups" ADD CONSTRAINT "result_groups_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "retractions" ADD CONSTRAINT "retractions_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "search_results" ADD CONSTRAINT "search_results_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studies" ADD CONSTRAINT "studies_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "study_references" ADD CONSTRAINT "study_references_nct_id_fkey" FOREIGN KEY ("nct_id") REFERENCES "studies"("nct_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

Done in 0.56s.
