<template>
  <!-- <template v-if="query">

    </template> -->
  <div class="flex justify-end mb-4">
    <button
      class="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
      :class="[
        isApplyingFilters
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700',
      ]"
      :disabled="isApplyingFilters || !canApplyFilters"
      @click="applyFilter"
    >
      {{ isApplyingFilters ? "Applying Filters..." : "Apply Filters" }}
    </button>
  </div>

  <template v-if="query == 'variants%coverage'">
    <div class="h-3/4">
      <general-event-chart
        title="Variants Coverage"
        :model-value="'percent'"
        statistic-mode="Variants"
        :dataset="statisticData"
        :key="query"
      />
    </div>

    <filter-slider
      placeholder="Variants coverage"
      insider-placeholder="Variants coverage"
      :min="0"
      :max="100"
      :step="1"
      value-format="%"
      v-model="variantsCoverage"
    />
  </template>
  <template v-else-if="query == 'events%coverage'">
    <div class="h-3/4">
      <general-event-chart
        title="Events Coverage"
        :model-value="'duration'"
        statistic-mode="Overview"
        :dataset="statisticData"
        :key="query"
      />
    </div>

    <filter-slider
      placeholder="Event coverage"
      insider-placeholder="Event coverage"
      :min="0"
      :max="100"
      :step="1"
      value-format="%"
      v-model="eventCoverage"
    />
  </template>
  <template v-else-if="query == 'case%duration'">
    <div class="h-3/4">
      <general-event-chart
        title="Events Coverage"
        :model-value="'duration'"
        statistic-mode="Cases"
        :dataset="statisticData"
        :key="query"
      />
    </div>
    <filter-slider
      placeholder="Case Duration"
      insider-placeholder="Case Duration Min"
      :min="CaseDuration.min"
      :max="CaseDuration.max"
      :step="0.1"
      :format="true"
      v-model="caseDurationMinVal"
    />
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Day</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMinDay"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Hour</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMinHour"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Minute</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMinMinute"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Second</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMinSecond"
        />
      </div>
    </div>
    <filter-slider
      placeholder="Case Duration"
      insider-placeholder="Case Duration Max"
      :min="CaseDuration.min"
      :max="CaseDuration.max"
      :step="0.1"
      :format="true"
      v-model="caseDurationMaxVal"
    />
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Day</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMaxDay"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Hour</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMaxHour"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Minute</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMaxMinute"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600 mb-1">Second</label>
        <input
          type="number"
          min="0"
          class="border rounded-lg px-3 py-2 text-sm"
          v-model.number="caseDurationMaxSecond"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="h-3/4">
      <general-event-chart
        title="Events Coverage"
        :model-value="'event_count'"
        statistic-mode="Cases"
        :dataset="statisticData"
        :key="query"
      />
    </div>
    <filter-slider
      placeholder="Number of Events"
      insider-placeholder="Number of Events Min"
      :min="NumberOfEvents.min"
      :max="NumberOfEvents.max"
      :step="1"
      v-model="numberOfEventsMinVal"
    />
    <filter-slider
      placeholder="Number of Events"
      insider-placeholder="Number of Events Max"
      :min="NumberOfEvents.min"
      :max="NumberOfEvents.max"
      :step="1"
      v-model="numberOfEventsMaxVal"
    />
  </template>
</template>

<script setup>
import { dateToSecond } from "~/utils/format";
const route = useRoute();
const query = computed(() => route.query.t);
const sessionCookie = useCookie("session_id");
const sessionId = computed(() => sessionCookie.value || "");
const statisticData = ref(null);
const { data, baseData } = useFile();
const { markFilterApplied } = useFilterSignal();
const { setSelection: setFilterSelection } = useFilterSelection();

const variantsCoverage = ref(100);
const eventCoverage = ref(100);
const caseDurationMinVal = ref();
const caseDurationMaxVal = ref();
const numberOfEventsMinVal = ref();
const numberOfEventsMaxVal = ref();

const caseDurationMinDay = ref(0);
const caseDurationMinHour = ref(0);
const caseDurationMinMinute = ref(0);
const caseDurationMinSecond = ref(0);
const caseDurationMaxDay = ref(0);
const caseDurationMaxHour = ref(0);
const caseDurationMaxMinute = ref(0);
const caseDurationMaxSecond = ref(0);

const isApplyingFilters = ref(false);
const filterError = ref(null);

const canApplyFilters = computed(() => !!sessionId.value);

onMounted(async () => {
  await fetchStatistic();
});

const buildRange = (values) => {
  const numericValues = (values || [])
    .map((val) => (typeof val === "number" ? val : Number(val)))
    .filter((val) => Number.isFinite(val));

  if (!numericValues.length) {
    return { min: 0, max: 0, hasData: false };
  }

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);

  return { min, max, hasData: true };
};

const sourceData = computed(() => baseData.value);

const caseStatistics = computed(() => {
  return (
    statisticData.value?.case || sourceData.value?.model_statistics?.case || []
  );
});

const CaseDuration = computed(() => {
  const caseDurations = caseStatistics.value.map((c) => c.duration);
  const range = buildRange(caseDurations);
  console.log("caseDurations range:", range);
  return range;
});

const NumberOfEvents = computed(() => {
  const numberOfEvents = caseStatistics.value.map((c) => c.event_count);
  const range = buildRange(numberOfEvents);
  console.log("numberOfEvents range:", range);
  return range;
});

// Initialize shared refs with computed bounds and keep them in sync on first data load
watch(
  CaseDuration,
  (range) => {
    if (!range.hasData) return;
    if (caseDurationMinVal.value === undefined)
      caseDurationMinVal.value = range.min;
    if (caseDurationMaxVal.value === undefined)
      caseDurationMaxVal.value = range.max;
  },
  { immediate: true },
);

watch(
  NumberOfEvents,
  (range) => {
    if (!range.hasData) return;
    if (numberOfEventsMinVal.value === undefined)
      numberOfEventsMinVal.value = range.min;
    if (numberOfEventsMaxVal.value === undefined)
      numberOfEventsMaxVal.value = range.max;
  },
  { immediate: true },
);

watch(
  () => [
    variantsCoverage.value,
    eventCoverage.value,
    caseDurationMinVal.value,
    caseDurationMaxVal.value,
    numberOfEventsMinVal.value,
    numberOfEventsMaxVal.value,
  ],
  ([
    newVariants,
    newEvents,
    newCaseMin,
    newCaseMax,
    newCaseSizeMin,
    newCaseSizeMax,
  ]) => {
    setFilterSelection({
      variantsCoverage: typeof newVariants === "number" ? newVariants : null,
      eventCoverage: typeof newEvents === "number" ? newEvents : null,
      caseDurationMin: newCaseMin,
      caseDurationMax: newCaseMax,
      minCaseSize: newCaseSizeMin,
      maxCaseSize: newCaseSizeMax,
    });
  },
  { immediate: true },
);

const normalizePercentage = (value, fallback = 1) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  const normalized = value / 100;
  if (normalized < 0) return 0;
  if (normalized > 1) return 1;
  return normalized;
};

const sanitizeNumber = (value) => {
  if (typeof value !== "number") return undefined;
  if (!Number.isFinite(value)) return undefined;
  return value;
};

const buildFilterPayload = () => {
  return {
    session_id: sessionId.value,
    variants_coverage: normalizePercentage(variantsCoverage.value, 1),
    events_coverage: normalizePercentage(eventCoverage.value, 1),
    case_duration_min: sanitizeNumber(caseDurationMinVal.value),
    case_duration_max: sanitizeNumber(caseDurationMaxVal.value),
    min_case_size: sanitizeNumber(numberOfEventsMinVal.value),
    max_case_size: sanitizeNumber(numberOfEventsMaxVal.value),
  };
};

const applyFilter = async () => {
  if (!sessionId.value) {
    console.warn("Session ID is required before applying filters.");
    return;
  }

  const payload = buildFilterPayload();
  isApplyingFilters.value = true;
  filterError.value = null;

  try {
    const response = await $fetch("/api/filter", {
      method: "POST",
      body: payload,
    });

    if (response?.data) {
      data.value = response.data;
    } else if (response) {
      data.value = response;
    }

    markFilterApplied();

    return response;
  } catch (error) {
    filterError.value = error;
    console.error("Error applying filters:", error);
    throw error;
  } finally {
    isApplyingFilters.value = false;
  }
};

watch(
  () => sessionId.value,
  (newSession, oldSession) => {
    if (newSession && newSession !== oldSession) {
      fetchStatistic();
    }
  },
);

const fetchStatistic = async () => {
  try {
    const response = await $fetch("/api/statistic", {
      method: "POST",
      body: {
        session_id: sessionId.value,
      },
    });
    console.log("Statistics fetched successfully:", response);
    statisticData.value = response.data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
  }
};

const splitSeconds = (totalSeconds) => {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return { days, hours, minutes, seconds };
};

const normalizeInputNumber = (value) => {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
};

const syncingMinFromInputs = ref(false);
const syncingMinFromSlider = ref(false);
const syncingMaxFromInputs = ref(false);
const syncingMaxFromSlider = ref(false);

const getCaseDurationMinLimit = () => CaseDuration.value?.min ?? 0;
const getCaseDurationMaxLimit = () => CaseDuration.value?.max ?? 0;

const applyMinInputsFromSeconds = (seconds) => {
  const parts = splitSeconds(seconds);
  syncingMinFromSlider.value = true;
  caseDurationMinDay.value = parts.days;
  caseDurationMinHour.value = parts.hours;
  caseDurationMinMinute.value = parts.minutes;
  caseDurationMinSecond.value = parts.seconds;
};

const applyMaxInputsFromSeconds = (seconds) => {
  const parts = splitSeconds(seconds);
  syncingMaxFromSlider.value = true;
  caseDurationMaxDay.value = parts.days;
  caseDurationMaxHour.value = parts.hours;
  caseDurationMaxMinute.value = parts.minutes;
  caseDurationMaxSecond.value = parts.seconds;
};

watch(
  () => [
    caseDurationMinDay.value,
    caseDurationMinHour.value,
    caseDurationMinMinute.value,
    caseDurationMinSecond.value,
  ],
  () => {
    if (syncingMinFromSlider.value) {
      syncingMinFromSlider.value = false;
      return;
    }
    const inputs = [
      caseDurationMinDay.value,
      caseDurationMinHour.value,
      caseDurationMinMinute.value,
      caseDurationMinSecond.value,
    ];
    const invalid = inputs.some(
      (val) => typeof val !== "number" || Number.isNaN(val) || val < 0,
    );
    if (invalid) {
      const fallback = getCaseDurationMinLimit();
      syncingMinFromInputs.value = true;
      caseDurationMinVal.value = fallback;
      applyMinInputsFromSeconds(fallback);
      return;
    }
    const seconds = dateToSecond(
      String(normalizeInputNumber(caseDurationMinDay.value)),
      String(normalizeInputNumber(caseDurationMinHour.value)),
      String(normalizeInputNumber(caseDurationMinMinute.value)),
      String(normalizeInputNumber(caseDurationMinSecond.value)),
    );
    syncingMinFromInputs.value = true;
    caseDurationMinVal.value = seconds;
  },
);

watch(
  () => caseDurationMinVal.value,
  (seconds) => {
    if (syncingMinFromInputs.value) {
      syncingMinFromInputs.value = false;
      return;
    }
    if (typeof seconds !== "number" || Number.isNaN(seconds)) return;
    applyMinInputsFromSeconds(seconds);
  },
);

watch(
  () => [
    caseDurationMaxDay.value,
    caseDurationMaxHour.value,
    caseDurationMaxMinute.value,
    caseDurationMaxSecond.value,
  ],
  () => {
    if (syncingMaxFromSlider.value) {
      syncingMaxFromSlider.value = false;
      return;
    }
    const inputs = [
      caseDurationMaxDay.value,
      caseDurationMaxHour.value,
      caseDurationMaxMinute.value,
      caseDurationMaxSecond.value,
    ];
    const invalid = inputs.some(
      (val) => typeof val !== "number" || Number.isNaN(val) || val < 0,
    );
    if (invalid) {
      const fallback = getCaseDurationMaxLimit();
      syncingMaxFromInputs.value = true;
      caseDurationMaxVal.value = fallback;
      applyMaxInputsFromSeconds(fallback);
      return;
    }
    const seconds = dateToSecond(
      String(normalizeInputNumber(caseDurationMaxDay.value)),
      String(normalizeInputNumber(caseDurationMaxHour.value)),
      String(normalizeInputNumber(caseDurationMaxMinute.value)),
      String(normalizeInputNumber(caseDurationMaxSecond.value)),
    );
    syncingMaxFromInputs.value = true;
    caseDurationMaxVal.value = seconds;
  },
);

watch(
  () => caseDurationMaxVal.value,
  (seconds) => {
    if (syncingMaxFromInputs.value) {
      syncingMaxFromInputs.value = false;
      return;
    }
    if (typeof seconds !== "number" || Number.isNaN(seconds)) return;
    applyMaxInputsFromSeconds(seconds);
  },
);
</script>
