"use client";
import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { createPizza } from "@/app/libs/visualization/createPizza";
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { useChartUpdates } from "@/app/hooks/useChartUpdates";
import { usePizzaState } from "@/app/hooks/usePizzaState";
const page = () => {
	const { data } = useQueryStore();
	const ref = useRef<HTMLDivElement>(null);
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const { primaryColumn, ringKey, sliceKey, sliceSet, ringSet, tooltip } = usePizzaState();
	const pizzaRef = useRef(createPizza());
	useChartUpdates(pizzaRef);
	const [render, setRender] = useState(false);
	useEffect(() => {
		if (ref.current && !render && refCanvas.current) {
			pizzaRef.current.primaryColumn(primaryColumn);
			pizzaRef.current.ratio(window.devicePixelRatio);
			pizzaRef.current.margin({ top: 120, right: 220, bottom: 0, left: 220 });
			pizzaRef.current.canvasWidth(refCanvas.current.width);
			pizzaRef.current.canvasHeight(refCanvas.current.height);
			pizzaRef.current.data(data);
			pizzaRef.current.sliceColumn(sliceKey);
			pizzaRef.current.tooltipData(tooltip);
			//@ts-ignore
			pizzaRef.current.sliceSet(sliceSet.map((slice) => (slice ??= undefined)));
			pizzaRef.current.ringColumn(ringKey);
			//@ts-ignore
			pizzaRef.current.ringSet(ringSet.map((ring) => (ring ??= undefined)));
			setRender(true);
		}
	}, []);

	useEffect(() => {
		if (render && ref.current) {
			select(ref.current).call(pizzaRef.current);
		}
	}, [render, select, ref.current]);

	return (
		<div className="p-4">
			<div ref={ref} className="relative">
				<div className="absolute bg-transparent w-full h-full z-10">
					<canvas
						id="shapes"
						width={1280 * window.devicePixelRatio}
						height={720 * window.devicePixelRatio}
						className="absolute w-full h-full z-10 bg-transparent aspect-video"
					/>
					<canvas
						id="hidden"
						width={1280 * window.devicePixelRatio}
						height={720 * window.devicePixelRatio}
						className="absolute w-full h-full bg-transparent aspect-video hidden"
					/>
					<canvas
						id="webgl"
						width={1280 * window.devicePixelRatio}
						height={720 * window.devicePixelRatio}
						className="absolute w-full h-full -z-10 bg-transparent aspect-video"
					/>
				</div>

				<canvas
					ref={refCanvas}
					id="background"
					width={1280 * window.devicePixelRatio}
					height={720 * window.devicePixelRatio}
					className="w-full h-full bg-slate-50 aspect-video -z-10"
				/>
			</div>
		</div>
	);
};

export default page;
