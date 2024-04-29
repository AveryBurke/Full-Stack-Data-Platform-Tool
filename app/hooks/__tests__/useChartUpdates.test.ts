import { renderHook, act } from "@testing-library/react";
import { useChartUpdates } from "../useChartUpdates";
import { createPizza } from "../../libs/visualization/createPizza";
import { usePizzaStateMock } from "../__mocks__/usePizzaState";
import { useFilterStateMock } from "../__mocks__/useFilterState";
import { useFilterState } from "../useFilterState";
import { testData } from "../../static/testData";

const mockSliceColumn = jest.fn();
const mockSliceSet = jest.fn();
const mockRingColumn = jest.fn();
const mockRingSet = jest.fn();
const mockUpdateData = jest.fn();

jest.mock("../../libs/visualization/createPizza", () => ({
	createPizza: jest.fn(() => ({
		sliceColumn: mockSliceColumn,
		sliceSet: mockSliceSet,
		ringColumn: mockRingColumn,
		ringSet: mockRingSet,
		data: mockUpdateData,
		ratio: jest.fn(),
		canvasWidth: jest.fn(),
		canvasHeight: jest.fn(),
		margin: { top: 0, right: 0, bottom: 0, left: 0 },
	})),
}));

jest.mock("../useQueryStorage", () => ({
	useQueryStore: () => ({ data: testData }),
}));

jest.mock("../usePizzaState", () => ({ usePizzaState: () => usePizzaStateMock() }));

jest.mock("../useFilterState", () => ({ useFilterState: () => useFilterStateMock() }));

describe("useChartUpdates", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("ring update behavior", () => {
		test("should update the ring set with the proper value, on ring key update", () => {
			const ref = { current: createPizza() };
			const { result } = renderHook(() => {
				useChartUpdates(ref);
			});
			const { result: pizzaStateResult } = renderHook(() => usePizzaStateMock());
			// we don't want to update state or the chart on the initial render
			act(() => {
				pizzaStateResult.current.setRingKey("First render");
			}); // 1
			expect(mockRingColumn).not.toHaveBeenCalled();
			act(() => {
				pizzaStateResult.current.setRingKey("eaten");
			}); // 2
			expect(mockRingColumn).toHaveBeenCalledWith("eaten");
			expect(mockRingSet).toHaveBeenCalledWith(["cooked", "raw", "cooked or raw"]);
		});
	});

	describe("slice update behavior", () => {
		test("should update the slice set with the proper value, on slice key update", () => {
			const ref = { current: createPizza() };
			const { result } = renderHook(() => {
				useChartUpdates(ref);
			});
			const { result: pizzaStateResult } = renderHook(() => usePizzaStateMock());
			// we don't want to update state or the chart on the initial render
			act(() => {
				pizzaStateResult.current.setSliceKey("First render");
			}); // 1
			expect(mockSliceColumn).not.toHaveBeenCalled();
			act(() => {
				pizzaStateResult.current.setSliceKey("type");
			}); // 2
			expect(mockSliceColumn).toHaveBeenCalledWith("type");
			expect(mockSliceSet).toHaveBeenCalledWith(["vegetable", "fruit"]);
		});
	});

	describe("filter update behavior", () => {
		test("should update the filter set with the proper value, on filter key update", () => {
			const ref = { current: createPizza() };
			const { result } = renderHook(() => {
				useChartUpdates(ref);
			});
			const { result: filterStateResult } = renderHook(() => useFilterState());
			// we don't want to update state or the chart on the initial render
			act(() => {
				filterStateResult.current.setFilterKey("First render");
			}); // 1
			expect(mockUpdateData).not.toHaveBeenCalled();
			act(() => {
				filterStateResult.current.setFilterKey("color");
			}); // 2
			expect(filterStateResult.current.filterSet).toEqual(
				["red", "orange", "green", "yellow", "purple", "brown", "blue", "white", "black", "pink"].map((value) => ({ value, filtered: false }))
			);
		});

		test("should filter the data and update the chart, when the filter set changes", () => {
			const ref = { current: createPizza() };
			const { result } = renderHook(() => {
				useChartUpdates(ref);
			});
			const { result: filterStateResult } = renderHook(() => useFilterState());
			act(() => filterStateResult.current.setFilterKey("type"));
			act(() => {
				filterStateResult.current.setFilterSet([
					{ value: "fruit", filtered: false },
					{ value: "vegetable", filtered: true }, // simulate a user checking the filter
				]);
			});
			expect(mockUpdateData).toHaveBeenCalledWith(testData.filter((d) => d.type !== "vegetable"));
		});

		test("should update the ring and slice counts, when the data or filters change", () => {
			const ref = { current: createPizza() };
			const { result } = renderHook(() => {
				useChartUpdates(ref);
			});
			const { result: pizzaStateResult } = renderHook(() => usePizzaStateMock());
			const { result: filterStateResult } = renderHook(() => useFilterState());
			act(() => pizzaStateResult.current.setRingKey("first render"));
			act(() => pizzaStateResult.current.setSliceKey("first render"));
			act(() => pizzaStateResult.current.setRingKey("type"));
			act(() => pizzaStateResult.current.setSliceKey("eaten"));
			act(() => filterStateResult.current.setFilterKey("type"));
			act(() => {
				filterStateResult.current.setFilterSet([
					{ value: "fruit", filtered: false },
					{ value: "vegetable", filtered: true }, // simulate a user checking the filter
				]);
			});
			// check that the counts have a prev value of 0 and a current value of the filtered data
			expect(pizzaStateResult.current.ringCounts).toEqual({ fruit: { current: 31, prev: 0 }, vegetable: { current: 0, prev: 0 } });
			expect(pizzaStateResult.current.sliceCounts).toEqual({
				cooked: { current: 0, prev: 0 },
				"cooked or raw": { current: 2, prev: 0 },
				raw: { current: 29, prev: 0 },
			});

			act(() => {
				filterStateResult.current.setFilterSet([
					{ value: "fruit", filtered: false },
					{ value: "vegetable", filtered: false }, // simulate a user unchecking the filter
				]);
			});
			// check that the counts have a previou values matching that matches the last test's current values and current values matching the unfiltered data
			expect(pizzaStateResult.current.ringCounts).toEqual({ fruit: { current: 31, prev: 31 }, vegetable: { current: 11, prev: 0 } });
			expect(pizzaStateResult.current.sliceCounts).toEqual({
				cooked: { current: 4, prev: 0 },
				"cooked or raw": { current: 6, prev: 2 },
				raw: { current: 32, prev: 29 },
			});
		});
	});
});
