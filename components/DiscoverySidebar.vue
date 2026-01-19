<template>
  <template v-if="route.path === '/discovery'">
    <div class="flex flex-col gap-2">
      <FileInfo />
    </div>
  </template>
  <template v-else-if="route.path === '/statistic'">
    <div class="flex flex-col gap-3">
      <div
        class="w-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg flex-shrink-0 overflow-scroll scrollbar-hidden"
      >
        <div>
          <div class="mt-2 space-y-3">
            <slot name="stats">
              <statistic-sidebar-button
                name="Overview"
                placeholder="Overview"
                @click="setSelectedStatistic('Overview')"
                :is-active="selectedStatistic === 'Overview'"
              />
              <statistic-sidebar-button
                name="Cases"
                placeholder="Cases"
                @click="setSelectedStatistic('Cases')"
                :icon="'mdi:folder-account'"
                :is-active="selectedStatistic === 'Cases'"
              />
              <statistic-sidebar-button
                name="Resources"
                placeholder="Resources"
                @click="setSelectedStatistic('Resources')"
                :icon="'fa6-brands:black-tie'"
                :is-active="selectedStatistic === 'Resources'"
              />
              <statistic-sidebar-button
                name="Variants"
                placeholder="Variants"
                @click="setSelectedStatistic('Variants')"
                :icon="'uil:arrow-right'"
                :is-active="selectedStatistic === 'Variants'"
              />
            </slot>
          </div>
        </div>
      </div>
      <GeneralDiscoveryInfoPanel />
    </div>
  </template>
  <template v-else>
    <div class="flex flex-col gap-4">
      <div
        class="w-64 h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg flex-shrink-1 overflow-scroll scrollbar-hidden"
      >
        <div>
          <div class="mt-2 flex flex-col space-y-3">
            <NuxtLink to="/filter?t=variants%coverage">
              <statistic-sidebar-button
                name="Variants Coverage"
                placeholder="Variants Coverage"
                :is-active="selectedStatistic === 'Variants Coverage'"
              />
            </NuxtLink>
            <NuxtLink to="/filter?t=events%coverage">
              <statistic-sidebar-button
                name="Events Coverage"
                placeholder="Events Coverage"
                :is-active="selectedStatistic === 'Events Coverage'"
              />
            </NuxtLink>
            <NuxtLink to="/filter?t=case%duration">
              <statistic-sidebar-button
                name="Case duration"
                placeholder="Case duration"
                :is-active="selectedStatistic === 'Case duration'"
              />
            </NuxtLink>
            <NuxtLink to="/filter?t=number%of%events">
              <statistic-sidebar-button
                name="Case Number of events"
                placeholder="Case Number of events"
                :is-active="selectedStatistic === 'Number of events'"
              />
            </NuxtLink>
            <div class="space-y-1">
              <label class="text-xs text-gray-600 pl-2" for="algorithm"
                >Selected Algorithm</label
              >
              <div class="relative">
                <select
                  @focus="isDropDownOpen = true"
                  @blur="isDropDownOpen = false"
                  v-model="selected"
                  class="appearance-none w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 pr-10 rounded-xl shadow-sm transition-all duration-200"
                >
                  <option
                    v-for="algorithm in miningAlgorithm"
                    :key="algorithm.value"
                    :value="algorithm.value"
                  >
                    {{ algorithm.label }}
                  </option>
                </select>
                <svg
                  :class="[
                    'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-transform duration-300 pointer-events-none',
                    isDropDownOpen ? 'transform rotate-180' : '',
                  ]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <slider
              placeholder="Noise Threshold"
              insider-placeholder="Noise Threshold"
              :min="0"
              :max="1"
              :step="0.01"
              :default-value="0"
              v-model="noiseThreshold"
            />
          </div>
        </div>
      </div>
      <button
        class="bg-red-400 text-white w-64 py-3 rounded-lg font-medium"
        @click="handleChangeAlgorithm()"
      >
        Send Filters!
      </button>
    </div>
  </template>
</template>

<script setup>
import { useFile } from "~/composables/useFile";
import { useFilters } from "~/composables/useFilters";

import { ref } from "vue";

const route = useRoute();

const { selectedStatistic, setSelectedStatistic } = useStatistic();

const miningAlgorithm = [
  {
    label: "Inductive Miner",
    value: "inductive",
  },
  {
    label: "Heuristic Miner",
    value: "heuristic",
  },
  {
    label: "Alpha Miner",
    value: "alpha",
  },
];

const caseDuration = [
  {
    label: "Detik",
    value: "second",
  },
  {
    label: "Menit",
    value: "minute",
  },
  {
    label: "Jam",
    value: "hour",
  },
  {
    label: "Hari",
    value: "day",
  },
  {
    label: "Minggu",
    value: "week",
  },
  {
    label: "Bulan",
    value: "month",
  },
  {
    label: "Tahun",
    value: "year",
  },
];

const { fileInfo, upload, applyFilters, data, baseData } = useFile();

const isDropDownOpen = ref(false);

const {
  noiseThreshold,
  variantsCoverage,
  eventCoverage,
  caseDurationMinVal,
  caseDurationMaxVal,
  numberOfEventsMinVal,
  numberOfEventsMaxVal,
  selectedAlgorithm,
} = useFilters();

watch(caseDurationMinVal, (newVal) => {
  console.log("[DiscoverySidebar] caseDurationMinVal changed:", newVal);
});

const selected = selectedAlgorithm;
const selectedDurationMin = ref("day");
const selectedDurationMax = ref("day");
const inputDurationMin = ref(0);
const inputDurationMax = ref(0);

watch(data, (newData) => {
  console.log("[DiscoverySidebar] data changed:", newData);
});

// ### SECTION MILIH ALGORITMA MINING ###
async function handleChangeAlgorithm() {
  console.log("[DEBUG] handleChangeAlgorithm called with:", selected.value);
  try {
    if (!fileInfo.value?.file) {
      throw new Error("No uploaded file found. Please upload a log first.");
    }

    const shouldUploadBase = !baseData.value;

    const request = shouldUploadBase
      ? upload(
          fileInfo.value.file,
          selected.value,
          noiseThreshold.value,
          variantsCoverage.value,
          eventCoverage.value,
          caseDurationMinVal.value,
          caseDurationMaxVal.value,
          numberOfEventsMinVal.value,
          numberOfEventsMaxVal.value
        )
      : applyFilters(
          selected.value,
          noiseThreshold.value,
          variantsCoverage.value,
          eventCoverage.value,
          caseDurationMinVal.value,
          caseDurationMaxVal.value,
          numberOfEventsMinVal.value,
          numberOfEventsMaxVal.value
        );

    await request;
    console.log("[DEBUG] Upload successful, received data:", data.value);
    // navigateTo("/discovery");
  } catch (error) {
    console.error("Error in handleChangeAlgorithm:", error);
  }
}
</script>

<style scoped>
/* component-specific styles if needed */
</style>
