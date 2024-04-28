import { renderHook, act } from "@testing-library/react";
import { useChartUpdates } from "../useChartUpdates";
import { createPizza } from "../../libs/visualization/createPizza";
import { usePizzaStateMock } from "../__mocks__/usePizzaState";
import { useFilterStateMock } from "../__mocks__/useFilterState";
import { useFilterState } from "../useFilterState";

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

//todo: we need better test data and more sophisticated filter tests

const testData = [
	{ id: 1, test: "test value a", test2: "test value b" },
	{ id: 2, test: "test value a", test2: "test value b" },
	{ id: 3, test: "test value a", test2: "test value b" },
	{ id: 4, test: "test value a", test2: "test value b" },
	{ id: 5, test: "test value a", test2: "test value b" },
	{ id: 6, test: "test value c", test2: "test value e" },
	{ id: 7, test: "test value c", test2: "test value e" },
	{ id: 8, test: "test value c", test2: "test value e" },
	{ id: 9, test: "test value c", test2: "test value e" },
	{ id: 10, test: "test value c", test2: "test value e" },
];

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
				pizzaStateResult.current.setRingKey("test");
			}); // 2
			expect(mockRingColumn).toHaveBeenCalledWith("test");
			expect(mockRingSet).toHaveBeenCalledWith(["test value a", "test value c"]);
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
				pizzaStateResult.current.setSliceKey("test2");
			}); // 2
			expect(mockSliceColumn).toHaveBeenCalledWith("test2");
			expect(mockSliceSet).toHaveBeenCalledWith(["test value b", "test value e"]);
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
				filterStateResult.current.setFilterKey("test");
			}); // 2
			expect(filterStateResult.current.filterSet).toEqual(["test value a", "test value c"].map((value) => ({ value, filtered: false })));
		});

		test("should filter the data and update the chart, when the filter set changes", () => {
			const ref = { current: createPizza() };
			const { result } = renderHook(() => {
				useChartUpdates(ref);
			});
			const { result: filterStateResult } = renderHook(() => useFilterState());
			// we don't want to update state or the chart on the initial render
			act(() => filterStateResult.current.setFilterKey("test"));
			act(() => {
				filterStateResult.current.setFilterSet([
					{ value: "test value a", filtered: false },
					{ value: "test value c", filtered: true }, // simulate a user checking the filter
				]);
			});
			expect(mockUpdateData).toHaveBeenCalledWith(testData.filter((d) => d.test !== "test value c"));
		});
	});
});
