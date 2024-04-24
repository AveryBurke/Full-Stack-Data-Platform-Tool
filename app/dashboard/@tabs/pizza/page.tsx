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
	const { ringKey, sliceKey, sliceSet, ringSet } = usePizzaState();

	const pizzaRef = useRef(createPizza());
	useChartUpdates(pizzaRef);
	const [render, setRender] = useState(false);
	useEffect(() => {
		if (ref.current && !render && refCanvas.current) {
			pizzaRef.current.ratio(window.devicePixelRatio);
			pizzaRef.current.margin({ top: 120, right: 220, bottom: 0, left: 220 });
			pizzaRef.current.canvasWidth(refCanvas.current.width);
			pizzaRef.current.canvasHeight(refCanvas.current.height);
			pizzaRef.current.data(data);
			pizzaRef.current.sliceColumn(sliceKey);
			pizzaRef.current.sliceSet(sliceSet);
			pizzaRef.current.ringColumn(ringKey);
			pizzaRef.current.ringSet(ringSet);
			setRender(true);
		}
	}, []);

	useEffect(() => {
		if (render && ref.current) {
			select(ref.current).call(pizzaRef.current);
		}
	}, [render, select, ref.current]);

	return (
		<div ref={ref} className="p-4">
			<canvas
				ref={refCanvas}
				id="background"
				width={1280 * window.devicePixelRatio}
				height={720 * window.devicePixelRatio}
				className="w-full h-full z-0 bg-slate-50 aspect-video"
			/>
		</div>
	);
};

export default page;
