"use client";
import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import {createPizza} from "@/app/libs/createPizza"
import { useQueryStore } from "@/app/hooks/useQueryStorage";
import { useChartUpdates } from "@/app/hooks/useChartUpdates";
import { usePizzaState } from "@/app/hooks/usePizzaState";
const page = () => {
  const {data} = useQueryStore();
	const ref = useRef<HTMLCanvasElement>(null);
  const {ringKey, sliceKey, sliceSet, ringSet} = usePizzaState();
  
  const pizzaRef = useRef(createPizza())
  useChartUpdates(pizzaRef);
  const [render, setRender] = useState(false)
	useEffect(() => {
		if (ref.current && !render) {
      pizzaRef.current.ratio(window.devicePixelRatio);
      pizzaRef.current.margin({ top: 120, right: 220, bottom: 0, left: 220 })
      pizzaRef.current.canvasWidth(ref.current.width);
      pizzaRef.current.canvasHeight(ref.current.height);
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
  },[render, select, ref.current]);

	return <div className="p-4"><canvas ref={ref} width={1280 * window.devicePixelRatio} height={720 * window.devicePixelRatio} className="w-full h-full bg-slate-50 aspect-video" /></div>;
};

export default page;
