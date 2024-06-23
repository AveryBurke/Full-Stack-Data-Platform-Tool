"use client";
import React from "react";
import { usePizzaState } from "@/app/hooks/usePizzaState";
import { useFilterState } from "@/app/hooks/useFilterState";
import SidebarComponentWrapper from "@/app/components/SidebarComponent";
import ControlPanel from "@/app/components/ControlePanel";
import CheckBoxControlePanel from "@/app/components/CheckBoxControlePanel";

const page = () => {
	const {
		primaryColumn,
		ringKey,
		sliceKey,
		sliceSet,
		ringSet,
		options,
		setPrimaryColumn,
		setRingKey,
		setSliceKey,
		setSliceSet,
		setRingSet,
		sliceCounts,
		ringCounts,
	} = usePizzaState();
	const { filterKey, filterSet, setFilterKey, setFilterSet } = useFilterState();

	return (
		<ul className="flex flex-col h-[575px] inheret gap-6 overflow-y-scroll pb-4">
			<li key="primary-column">
				<SidebarComponentWrapper
					title="primary column"
					currentKey={primaryColumn}
					options={options}
					handleChange={setPrimaryColumn}
					handleReset={() => setPrimaryColumn("internalId")}
					sidebarComponentOptions={{
						tooltip: {
							header: "Primary Column",
							body: [
								"Identify rows based on the values in this column.",
								"Each row will be represented by a shape in the pizza chart.",
								"When the data set is updated, the primary column will be used to identify which shapes have been added, removed, or updated.",
								"If the primary column is not set the data will be overwritten on each update.",
								"The values in the primary column must be unique."
														],
							alignment: { x: "right", y: "center" },
						},
					}}
				/>
			</li>
			<li key="slice">
				<SidebarComponentWrapper
					title="slice"
					currentKey={sliceKey}
					options={options}
					handleChange={setSliceKey}
					handleReset={() => setSliceKey("")}
					sidebarComponentOptions={{
						tooltip: {
							header: "Slice Column",
							body: ["Group the data into slices, based on the values in this column."],
							alignment: { x: "right", y: "center" },
						},
					}}>
					<ControlPanel set={sliceSet} onChange={setSliceSet} counts={sliceCounts} />
				</SidebarComponentWrapper>
			</li>
			<li key="ring">
				<SidebarComponentWrapper
					title="ring"
					currentKey={ringKey}
					options={options}
					handleChange={setRingKey}
					handleReset={() => setRingKey("")}
					sidebarComponentOptions={{
						tooltip: {
							header: "Ring Column",
							body: ["Group the data into rings, based on the values in this column."],
							alignment: { x: "right", y: "center" },
						},
					}}>
					<ControlPanel set={ringSet} onChange={setRingSet} counts={ringCounts} />
				</SidebarComponentWrapper>
			</li>
			<li key="filter">
				<SidebarComponentWrapper
					title="filter"
					currentKey={filterKey}
					options={options}
					handleChange={setFilterKey}
					handleReset={() => setFilterKey("")}
					sidebarComponentOptions={{
						tooltip: {
							header: "Filter Column",
							body: ["Filter the data based on the values in this column."],
							alignment: { x: "right", y: "top" },
						},
					}}>
					<CheckBoxControlePanel set={filterSet} onChange={setFilterSet} />
				</SidebarComponentWrapper>
			</li>
		</ul>
	);
};

export default page;
