"use client";
import React, { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
	const [rect, setRect] = React.useState<DOMRect | null>(null);
	// const Portal = usePortal(document.body);

	const ref = React.useRef(null);

	// observe the target element for resize events
	// this makes the sidebar responsive even though it is rendered as a portal
	useLayoutEffect(() => {
		const observeTarget = ref.current;
		if (!observeTarget) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const clientRect = entry.target.getBoundingClientRect();
				setRect(clientRect);
			}
		});

		resizeObserver.observe(observeTarget);

		return () => {
			resizeObserver.unobserve(observeTarget);
		};
	}, []);
	// render the sidebar as a portal, because styling on the parent is
	// throwing off the drag and drop coordiantes
	return (
		<>
			<div ref={ref} className="w-full h-full"></div>
			{createPortal(
				<ul
					style={{ left: rect?.left || 0, top: rect?.top || 0, width: rect?.width || 0 }}
					className="absolute flex flex-col h-[575px] inheret gap-6 overflow-y-scroll pb-4">
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
										"When the data set is updated, the primary column will be used to identify which rows have been added, removed, or changed.",
										"If the primary column is not set the data will be overwritten on each update.",
										"The values in the primary column must be unique.",
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
				</ul>,
				document.body
			)}
		</>
	);
};

export default page;
