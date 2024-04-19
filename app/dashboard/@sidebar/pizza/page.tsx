"use client";
import React from "react";
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { usePizzaState } from "@/app/hooks/usePizzaState";
import SidebarComponentWrapper from "@/app/components/SidebarComponent";
import ControlPanel from "@/app/components/ControlePanel";

const page = () => {
	const { data } = useQueryStore();
	const { ringKey, sliceKey, sliceSet, ringSet, options, setRingKey, setSliceKey, setSliceSet, setRingSet } = usePizzaState();
	return (
		<ul className="flex flex-col gap-6">
			<li>
				<SidebarComponentWrapper
					title="slice"
					currentKey={sliceKey}
					options={options}
					handleChange={setSliceKey}
					handleReset={() => setSliceKey("")}>
					<ControlPanel set={sliceSet} onChange={setSliceSet} />
				</SidebarComponentWrapper>
			</li>
			<li>
				<SidebarComponentWrapper
					title="ring"
					currentKey={ringKey}
					options={options}
					handleChange={setRingKey}
					handleReset={() => setRingKey("")}>
					<ControlPanel set={ringSet} onChange={setRingSet} />
				</SidebarComponentWrapper>
			</li>
		</ul>
	);
};

export default page;
