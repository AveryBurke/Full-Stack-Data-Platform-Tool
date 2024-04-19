"use client";
import React from "react";
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { usePizzaState } from "@/app/hooks/usePizzaState";
import SidebarComponentWrapper from "@/app/components/SidebarComponent";
import ControlPanel from "@/app/components/ControlePanel";

const page = () => {
	const { data } = useQueryStore();
	const { ringKey, sliceKey, sliceSet, ringSet, options, setRingKey, setSliceKey, setSliceSet } = usePizzaState();
	return (
		<li>
			<SidebarComponentWrapper
				title="slice"
				currentKey={sliceKey}
				options={options}
				handleChange={setSliceKey}
				set={sliceSet}
				handleReset={() => console.log("reset")}
			>
        <ControlPanel set={sliceSet} onChange={setSliceSet}/>
        </SidebarComponentWrapper>
		</li>
	);
};

export default page;
