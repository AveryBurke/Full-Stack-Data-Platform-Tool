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
	const primaryColumnTooltip =
		`Choose a primary column.\n
		The values in this column are used to tack changes in data, when the data set is updated.\n
		If no primary column is selected, the data will be overwritten on each update.\n
		The values in this column must be unique`;
	return (
		<ul className="flex flex-col flex-grow gap-6">
			<li key="primary-column">
				<SidebarComponentWrapper
					title="primary column"
					currentKey={primaryColumn}
					options={options}
					handleChange={setPrimaryColumn}
					handleReset={() => setPrimaryColumn("internalId")}
					tooltipText={primaryColumnTooltip}
				/>
			</li>
			<li key="slice">
				<SidebarComponentWrapper title="slice" currentKey={sliceKey} options={options} handleChange={setSliceKey} handleReset={() => setSliceKey("")} >
					<ControlPanel set={sliceSet} onChange={setSliceSet} counts={sliceCounts} />
				</SidebarComponentWrapper>
			</li>
			<li key="ring">
				<SidebarComponentWrapper title="ring" currentKey={ringKey} options={options} handleChange={setRingKey} handleReset={() => setRingKey("")}>
					<ControlPanel set={ringSet} onChange={setRingSet} counts={ringCounts} />
				</SidebarComponentWrapper>
			</li>
			<li key="filter">
				<SidebarComponentWrapper title="filter" currentKey={filterKey} options={options} handleChange={setFilterKey} handleReset={() => setFilterKey("")}>
					<CheckBoxControlePanel set={filterSet} onChange={setFilterSet} />
				</SidebarComponentWrapper>
			</li>
		</ul>
	);
};

export default page;
