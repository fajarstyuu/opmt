export function useFilters() {
  // General filters
  const noiseThreshold = useState<number>("filters-noise-threshold", () => 0);
  const variantsCoverage = useState<number>(
    "filters-variants-coverage",
    () => 100,
  );
  const eventCoverage = useState<number>("filters-event-coverage", () => 100);

  // Case duration filters
  const caseDurationMinVal = useState<number | undefined>(
    "filters-case-duration-min",
    () => undefined,
  );
  const caseDurationMaxVal = useState<number | undefined>(
    "filters-case-duration-max",
    () => undefined,
  );

  // Number of events filters
  const numberOfEventsMinVal = useState<number | undefined>(
    "filters-number-of-events-min",
    () => undefined,
  );
  const numberOfEventsMaxVal = useState<number | undefined>(
    "filters-number-of-events-max",
    () => undefined,
  );

  const selectedAlgorithm = useState<string>(
    "filters-selected-algorithm",
    () => "inductive",
  );

  return {
    noiseThreshold,
    variantsCoverage,
    eventCoverage,
    caseDurationMinVal,
    caseDurationMaxVal,
    numberOfEventsMinVal,
    numberOfEventsMaxVal,
    selectedAlgorithm,
  };
}
