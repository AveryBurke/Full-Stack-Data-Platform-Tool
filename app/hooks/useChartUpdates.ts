import { usePizzaState } from "./usePizzaState";
import { useFilterState } from "./useFilterState";
import { useRef, useEffect, RefObject } from "react";
import { useQueryStore } from "./useQueryStorage";
import { createPizza } from "@/app/libs/visualization/createPizza";
import deepEqual from "deep-equal";

// make the ref chart and the sidebar reactive to changes in the data, filters, ring and slice keys
export const useChartUpdates = (ref: RefObject<ReturnType<typeof createPizza>>) => {
	const { data } = useQueryStore();
	const { ringKey, ringSet, sliceKey, sliceSet, setRingSet, setSliceSet, setOptions, setSliceCounts, setRingCounts } = usePizzaState();
	const { filterKey, filterSet, setFilterSet } = useFilterState();
	const numberOfSliceUpdate = useRef(0);
	const numberOfRingUpdate = useRef(0);
	const numberOfFilterUpdate = useRef(0);
	const refData = useRef<any[]>([]);

	// update the filter set in state, when the filter key changes
	useEffect(() => {
		numberOfFilterUpdate.current++;
		if (!ref.current) return;
		// we only want to update the filter set after the initial render cycle
		if (numberOfFilterUpdate.current <= 2) return;
		const filterSet = [...new Set(data.map((d: any) => d[filterKey]))].map((value: string) => ({ value, filtered: false }));
		setFilterSet(filterSet);
	}, [filterKey, ref.current]);

	// update the ring and slice counts for the sidebar component, when the data or filters change
	useEffect(() => {
		if (!ref.current) return;
		const filters = filterSet.filter((f) => !f.filtered).map((f) => f.value);
		const filteredData = data.filter((d) => filters.includes(d[filterKey]));
		const ringCounts = Object.fromEntries(ringSet.map((ring) => [ring, filteredData.filter((d) => d[ringKey] === ring).length]));
		const sliceCounts = Object.fromEntries(sliceSet.map((slice) => [slice, filteredData.filter((d) => d[sliceKey] === slice).length]));
		setRingCounts(ringCounts);
		setSliceCounts(sliceCounts);
	}, [filterSet, ref.current, data, ringKey, sliceKey, ringSet, sliceSet]);

	// update the ring set in state, when the ring key changes
	useEffect(() => {
		numberOfRingUpdate.current++;
		if (!ref.current) return;
		// we only want to update the ring set after the initial render cycle
		if (numberOfRingUpdate.current <= 2) return;
		ref.current.ringColumn(ringKey);
		const ringSet = [...new Set(data.map((d: any) => d[ringKey]))];
		setRingSet(ringSet);
	}, [ringKey, ref.current]);

	// update the slice set in state, when the slice key changes
	useEffect(() => {
		numberOfSliceUpdate.current++;
		if (!ref.current) return;
		// we only want to update the slice set after the initial render cycle
		if (numberOfSliceUpdate.current <= 2) return;
		ref.current.sliceColumn(sliceKey);
		const sliceSet = [...new Set(data.map((d: any) => d[sliceKey]))];
		setSliceSet(sliceSet);
	}, [sliceKey, ref.current]);

	// update ring set in the pizza chart, when the ring set in state changes
	useEffect(() => {
		if (!ref.current) return;
		ref.current.ringSet(ringSet);
	}, [ringSet, ref.current]);

	// update slice set in the pizza chart, when the slice set in state changes`
	useEffect(() => {
		if (!ref.current) return;
		ref.current.sliceSet(sliceSet);
	}, [sliceSet, ref.current]);

	// update the data in the pizza chart, when the data in state changes or when the filter set changes (but not the filter key)
	useEffect(() => {
		if (!ref.current) return;
		const options = Object.keys(data[0] || {});
		setOptions(options.map((key) => ({ value: key, label: key })));
		const filters = filterSet.filter((f) => !f.filtered).map((f) => f.value);
		const filteredData = data.filter((d) => filters.includes(d[filterKey]));
		/// WARNING: this might be very expensive with long data sets
		if (deepEqual(filteredData, refData.current)) return;
		refData.current = filteredData;
		ref.current.data(filteredData);
	}, [data, ref.current, filterSet]);
};
