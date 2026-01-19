interface FilterSelection {
  variantsCoverage: number | null;
  eventCoverage: number | null;
  caseDurationMin: number | null | undefined;
  caseDurationMax: number | null | undefined;
  minCaseSize: number | null | undefined;
  maxCaseSize: number | null | undefined;
}

const defaultSelection = (): FilterSelection => ({
  variantsCoverage: 100,
  eventCoverage: 100,
  caseDurationMin: undefined,
  caseDurationMax: undefined,
  minCaseSize: undefined,
  maxCaseSize: undefined,
});

export const useFilterSelection = () => {
  const selection = useState<FilterSelection>("filter-selection", () =>
    defaultSelection()
  );

  const setSelection = (partial: Partial<FilterSelection>) => {
    selection.value = {
      ...selection.value,
      ...partial,
    };
  };

  const resetSelection = () => {
    selection.value = defaultSelection();
  };

  return {
    selection,
    setSelection,
    resetSelection,
  };
};
