"use client";
import React from "react";
import { usePizzaState } from "@/app/hooks/usePizzaState";
import { useFilterState } from "@/app/hooks/useFilterState";
import SidebarComponentWrapper from "@/app/components/SidebarComponent";
import ControlPanel from "@/app/components/ControlePanel";
import CheckBoxControlePanel from "@/app/components/CheckBoxControlePanel";

const page = () => {

	const { ringKey, sliceKey, sliceSet, ringSet, options, setRingKey, setSliceKey, setSliceSet, setRingSet, sliceCounts, ringCounts } = usePizzaState();
	const { filterKey, filterSet, setFilterKey, setFilterSet } = useFilterState();

	return (
		<ul className="flex flex-col flex-grow gap-6">
			<li>
				<SidebarComponentWrapper title="slice" currentKey={sliceKey} options={options} handleChange={setSliceKey} handleReset={() => setSliceKey("")}>
					<ControlPanel set={sliceSet} onChange={setSliceSet} counts={sliceCounts} />
				</SidebarComponentWrapper>
			</li>
			<li>
				<SidebarComponentWrapper title="ring" currentKey={ringKey} options={options} handleChange={setRingKey} handleReset={() => setRingKey("")}>
					<ControlPanel set={ringSet} onChange={setRingSet} counts={ringCounts} />
				</SidebarComponentWrapper>
			</li>
			<li>
				<SidebarComponentWrapper title="filter" currentKey={filterKey} options={options} handleChange={setFilterKey} handleReset={() => setFilterKey("")}>
					<CheckBoxControlePanel set={filterSet} onChange={setFilterSet} />
				</SidebarComponentWrapper>
			</li>
		</ul>
	);
};

export default page;
