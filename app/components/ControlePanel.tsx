"use client";
import React from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import CountUp from "react-countup";

interface ControlPanelProps {
	set: string[];
	counts: { [key: string]: { current: number; prev: number } };
	onChange: (set: string[]) => void;
	scaleGenerator?: (scale: string) => JSX.Element;
}

/**
 * for a given parameter create a sidebar component {@link ./SidebarComponentWrapper} with an optional extra visula guide
 * @param param0 the parameter and the optional generator funciton for the visual guide
 * @returns a sidebar component with a sortable controle panel and approprate update hanlders
 */
const ControlPanel: React.FC<ControlPanelProps> = ({ set, onChange, counts, scaleGenerator }) => {
	const hanldeDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const setCopy = [...set];
		const [reorderedItem] = setCopy.splice(result.source.index, 1);
		setCopy.splice(result.destination.index, 0, reorderedItem);
		onChange(setCopy);
	};

	return (
		<DragDropContext onDragEnd={hanldeDragEnd}>
			<StrictModeDroppable droppableId="characters">
				{(provided) => (
					<ul className="characters rounded bg-[#abb2bf] bg-opacity-50 p-1 flex flex-col gap-[2px]" {...provided.droppableProps} ref={provided.innerRef}>
						{set.map((member, index) => {
							return (
								<Draggable key={member} draggableId={member} index={index}>
									{(provided) => (
										<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
											<div className={"flex flex-row justify-between items-center p-1 bg-[#282a36] rounded text-sm text-slate-50 transition-all duration-200 hover:bg-opacity-75 active:bg-opacity-75 active:z-10 " + ((!counts[member] || !counts[member].current) && " text-slate-500")}>
												{member}
												{counts[member] && <CountUp className="text-xs text-slate-300" start={counts[member].prev || 0} end={counts[member].current || 0} />}
											</div>
										</li>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</ul>
				)}
			</StrictModeDroppable>
		</DragDropContext>
	);
};
export default ControlPanel;
