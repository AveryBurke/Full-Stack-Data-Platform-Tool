import { usePizzaState } from "./usePizzaState";
import { useEffect } from "react";
import { useQueryStore } from "./useQueryStorage";
import { RefObject } from "react";
import { createPizza } from "@/app/libs/createPizza";

export const useChartUpdates = (ref: RefObject<ReturnType<typeof createPizza>>) => {
	const { data } = useQueryStore();
	const { ringKey, ringSet, sliceKey, sliceSet, setRingSet, setSliceSet, setOptions } = usePizzaState();

	useEffect(() => {
		if (ref.current) {
			ref.current.ringColumn(ringKey);
			const ringSet = [...new Set(data.map((d: any) => d[ringKey]))];
			setRingSet(ringSet);
		}
	}, [ringKey, ref.current]);

	useEffect(() => {
		if (ref.current) {
			const sliceSet = [...new Set(data.map((d: any) => d[sliceKey]))];
			setSliceSet(sliceSet);
		}
	}, [sliceKey, ref.current]);

	useEffect(() => {
		if (ref.current) {
			ref.current.ringSet(ringSet);
		}
	}, [sliceSet, ref.current]);

	useEffect(() => {
		if (ref.current) {
			ref.current.sliceSet(sliceSet);
		}
	}, [sliceSet, ref.current]);

	useEffect(() => {
		if (ref.current && data.length > 0) {
			const options = Object.keys(data[0]);
            setOptions(options.map((key) => ({ value: key, label: key })));
			ref.current.data(data);
		}
	}, [data, ref.current]);
};
