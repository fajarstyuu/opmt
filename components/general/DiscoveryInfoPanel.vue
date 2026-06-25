<template>
  <div
    class="w-full lg:w-64 flex-1 min-h-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-4 lg:p-6 overflow-y-auto scrollbar-hidden"
  >
    <!-- Section Informasi -->
    <div>
      <h2 class="text-xl font-bold text-gray-800">Information</h2>
      <div class="mt-2 space-y-2">
        <slot name="stats">
          <information-label placeholder="Jumlah Case" :content="totalCase" />
          <information-label
            placeholder="Jumlah Variants"
            :content="totalVariants"
          />
          <information-label
            placeholder="Jumlah Events"
            :content="totalEvents"
          />
          <information-label
            placeholder="Median Duration (Hari)"
            :content="totalMedianDuration"
          />
          <information-label
            placeholder="Mean Duration (Hari)"
            :content="totalMeanDuration"
          />
          <information-label placeholder="Start Time" :content="startTime" />
          <information-label placeholder="End Time" :content="endTime" />
          <information-label placeholder="Places" :content="numberOfPlaces" />
          <information-label
            placeholder="Transitions"
            :content="numberOfTransitions"
          />
          <information-label placeholder="Arcs" :content="numberOfArcs" />
        </slot>
      </div>
    </div>

    <!-- Section Conformance -->
    <!-- <div class="mt-6">
      <h2 class="text-xl font-bold text-gray-800">Conformance Metrics</h2>
      <div class="mt-2 space-y-3">
        <information-label placeholder="Fitness" :content="fitness" />
        <information-label placeholder="Precision" :content="precision" />
        <information-label
          placeholder="Generalization"
          :content="generalization"
        />
        <information-label placeholder="Simplicity" :content="simplicity" />
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFile } from "~/composables/useFile";
import { useStatistic } from "~/composables/useStatistic";
import { secondToDayString } from "~/utils/format";

const { data: datas } = useFile();
const { generalStatistics } = useStatistic();

function removeMilliseconds(str) {
  return typeof str === "string" && str.includes(".")
    ? str.split(".")[0]
    : str || "N/A";
}

const generalData = computed(() => generalStatistics.value);

function preferGeneralNumber(getter) {
  const data = generalData.value;
  if (data) {
    const value = getter(data);
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return null;
}

const fitness = computed(() => {
  if (datas?.value?.petri_net?.conformance_metrics) {
    const v =
      datas.value.petri_net.conformance_metrics.fitness?.average_trace_fitness;
    return typeof v === "number" ? v.toFixed(3) : 0;
  }
  return 0;
});

const precision = computed(() => {
  if (datas?.value?.petri_net?.conformance_metrics) {
    const v = datas.value.petri_net.conformance_metrics.precision;
    return typeof v === "number" ? v.toFixed(3) : 0;
  }
  return 0;
});

const generalization = computed(() => {
  if (datas?.value?.petri_net?.conformance_metrics) {
    const v = datas.value.petri_net.conformance_metrics.generalization;
    return typeof v === "number" ? v.toFixed(3) : 0;
  }
  return 0;
});

const simplicity = computed(() => {
  if (datas?.value?.petri_net?.conformance_metrics) {
    const v = datas.value.petri_net.conformance_metrics.simplicity;
    return typeof v === "number" ? v.toFixed(3) : 0;
  }
  return 0;
});

function fallbackModelStat(getter, formatter = (val) => val ?? 0) {
  if (datas?.value?.petri_net?.model_statistics) {
    const value = getter(datas.value.petri_net.model_statistics);
    if (value !== undefined && value !== null) {
      return formatter(value);
    }
  }
  return formatter(undefined);
}

const totalCase = computed(() => {
  const generalValue = preferGeneralNumber((data) => data.number_of_cases);
  if (generalValue !== null) return generalValue;
  return fallbackModelStat(
    (stats) => stats.number_of_cases,
    (val) => val || 0,
  );
});

const totalVariants = computed(() => {
  const generalValue = preferGeneralNumber((data) => data.number_of_variants);
  if (generalValue !== null) return generalValue;
  return fallbackModelStat(
    (stats) => stats.number_of_variants,
    (val) => val || 0,
  );
});

const totalEvents = computed(() => {
  const generalValue = preferGeneralNumber((data) => data.number_of_events);
  if (generalValue !== null) return generalValue;
  return fallbackModelStat(
    (stats) => stats.number_of_events,
    (val) => val || 0,
  );
});

const formatDurationToDays = (seconds) => {
  if (typeof seconds !== "number" || Number.isNaN(seconds))
    return "0hari 0jam 0menit";
  return secondToDayString(Math.max(0, seconds));
};

const totalMedianDuration = computed(() => {
  const generalValue = preferGeneralNumber(
    (data) => data.median_case_duration_seconds,
  );
  if (generalValue !== null) return formatDurationToDays(generalValue);
  return fallbackModelStat(
    (stats) => stats.median_case_duration_seconds,
    (val) => formatDurationToDays(val || 0),
  );
});

const totalMeanDuration = computed(() => {
  const generalValue = preferGeneralNumber(
    (data) => data.mean_case_duration_seconds,
  );
  if (generalValue !== null) return formatDurationToDays(generalValue);
  return fallbackModelStat(
    (stats) => stats.mean_case_duration_seconds,
    (val) => formatDurationToDays(val || 0),
  );
});

const startTime = computed(() => {
  if (generalData.value?.start_time) {
    return removeMilliseconds(generalData.value.start_time);
  }
  return fallbackModelStat(
    (stats) => stats.start_time,
    (val) => removeMilliseconds(val) || "N/A",
  );
});

const endTime = computed(() => {
  if (generalData.value?.end_time) {
    return removeMilliseconds(generalData.value.end_time);
  }
  return fallbackModelStat(
    (stats) => stats.end_time,
    (val) => removeMilliseconds(val) || "N/A",
  );
});

const numberOfPlaces = computed(() => {
  const generalValue = preferGeneralNumber((data) => data.number_of_places);
  return generalValue ?? 0;
});

const numberOfTransitions = computed(() => {
  const generalValue = preferGeneralNumber(
    (data) => data.number_of_transitions,
  );
  return generalValue ?? 0;
});

const numberOfArcs = computed(() => {
  const generalValue = preferGeneralNumber((data) => data.number_of_arcs);
  return generalValue ?? 0;
});

const noiseThresholdUsed = computed(() => {
  const generalValue = preferGeneralNumber((data) => data.noise_threshold_used);
  if (generalValue !== null) return generalValue.toFixed(2);
  return "N/A";
});
</script>

<style scoped>
/* component-specific styles if needed */
</style>
