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
		<ul className="flex flex-col flex-grow gap-6">
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
								"The column that will be used as the primary key for the data",
								"This column will be used to track changes in data when the data set is updated",
								"If no column is selected, data will be overwritten when the data set is updated",
								"The values in this column must be unique for each row in the data set",
							],
							alignment: { x: "right", y: "center"}
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
							alignment: { x: "right", y: "center"}
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
							alignment: { x: "right", y: "top"}
						},
					}}>
					<CheckBoxControlePanel set={filterSet} onChange={setFilterSet} />
				</SidebarComponentWrapper>
			</li>
		</ul>
	);
};

export default page;
