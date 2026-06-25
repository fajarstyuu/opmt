<template>
  <div class="overflow-auto rounded-3xl space-y-8">
    <template v-if="statisticPending">
      <div
        class="bg-white rounded-2xl p-6 shadow-md h-80 space-y-6 animate-pulse"
      >
        <div class="flex items-center gap-3">
          <div class="h-4 w-16 bg-gray-200 rounded"></div>
          <div class="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <div class="flex-1 bg-gray-100 rounded-xl"></div>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-md space-y-4 animate-pulse">
        <div
          v-for="index in 6"
          :key="`skeleton-row-${index}`"
          class="h-4 bg-gray-200 rounded"
        ></div>
      </div>
    </template>
    <template v-else>
      <div class="bg-white rounded-2xl p-4 md:p-6 shadow-md h-80 space-y-4">
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-600">Metric:</label>
          <select
            v-model="selectedStatisticData"
            class="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <template v-if="normalizedSelectedStatistic === 'Overview'">
              <option value="count">Frequency</option>
              <option value="percent">Percentage</option>
              <option value="median">Median Duration</option>
              <option value="mean">Average Duration</option>
              <option value="range">Duration</option>
            </template>
            <template v-else-if="normalizedSelectedStatistic === 'Cases'">
              <option value="event_count">Events</option>
              <option value="duration">Duration</option>
            </template>
            <template v-else-if="normalizedSelectedStatistic === 'Resources'">
              <option value="count">Frequency</option>
              <option value="percent">Percentage</option>
            </template>
            <template v-else-if="normalizedSelectedStatistic === 'Variants'">
              <option value="count">Frequency</option>
              <option value="percent">Percentage</option>
            </template>
          </select>
        </div>
        <StatisticChart :selectedStatisticData="selectedStatisticData" />
      </div>
      <div class="overflow-x-auto rounded-2xl shadow scrollbar-hidden">
        <table class="min-w-full bg-white rounded-2xl overflow-hidden">
          <thead>
            <tr>
              <th v-for="value in selectedHeaders" class="px-4 py-2 border">
                {{ value }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="normalizedSelectedStatistic === 'Overview'">
              <template v-if="statisticTableData.length === 0">
                <tr>
                  <td
                    class="px-4 py-2 border text-center"
                    :colspan="selectedHeaders.length"
                  >
                    No data available.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, index) in statisticTableData" :key="index">
                  <td class="px-4 py-2 border">{{ row.activity }}</td>
                  <td class="px-4 py-2 border">{{ row.count }}</td>
                  <td class="px-4 py-2 border">{{ row.percent }}</td>
                  <td class="px-4 py-2 border">
                    {{ formatDuration(row.median) }}
                  </td>
                  <td class="px-4 py-2 border">
                    {{ formatDuration(row.mean) }}
                  </td>
                  <td class="px-4 py-2 border">
                    {{ formatDuration(row.range) }}
                  </td>
                </tr>
              </template>
            </template>
            <template v-else-if="normalizedSelectedStatistic === 'Cases'">
              <template v-if="statisticTableData.length === 0">
                <tr>
                  <td
                    class="px-4 py-2 border text-center"
                    :colspan="selectedHeaders.length"
                  >
                    No data available.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, index) in statisticTableData" :key="index">
                  <td class="px-4 py-2 border">{{ row.case_id }}</td>
                  <td class="px-4 py-2 border">{{ row.event_count }}</td>
                  <td class="px-4 py-2 border">{{ row.start_time }}</td>
                  <td class="px-4 py-2 border">{{ row.end_time }}</td>
                  <td class="px-4 py-2 border">
                    {{ formatDuration(row.duration) }}
                  </td>
                </tr>
              </template>
            </template>
            <template v-else-if="normalizedSelectedStatistic === 'Resources'">
              <template v-if="statisticTableData.length === 0">
                <tr>
                  <td
                    class="px-4 py-2 border text-center"
                    :colspan="selectedHeaders.length"
                  >
                    No data available.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, index) in statisticTableData" :key="index">
                  <td class="px-4 py-2 border">{{ row.resource }}</td>
                  <td class="px-4 py-2 border">{{ row.count }}</td>
                  <td class="px-4 py-2 border">{{ row.percent }}</td>
                </tr>
              </template>
            </template>
            <template v-else-if="normalizedSelectedStatistic === 'Variants'">
              <template v-if="statisticTableData.length === 0">
                <tr>
                  <td
                    class="px-4 py-2 border text-center"
                    :colspan="selectedHeaders.length"
                  >
                    No data available.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, index) in statisticTableData" :key="index">
                  <td class="px-4 py-2 border">{{ row.variant }}</td>
                  <td class="px-4 py-2 border">{{ row.count }}</td>
                  <td class="px-4 py-2 border">{{ row.percent }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from "vue";
import StatisticChart from "~/components/general/StatisticChart.vue";
// Charting handled inside StatisticChart component

const {
  selectedStatistic,
  statisticTableData,
  statisticPending,
  fetchStatistic,
} = useStatistic();

const { filterStatus, resetFilterStatus } = useFilterSignal();

const sessionCookie = useCookie("session_id");

watch(
  () => sessionCookie.value,
  (value) => {
    if (value) {
      fetchStatistic();
    }
  },
  { immediate: true },
);

watch(
  () => filterStatus.value,
  async (status) => {
    if (status === 1) {
      await fetchStatistic({ force: true });
      resetFilterStatus();
    }
  },
);

const normalizedSelectedStatistic = computed(() =>
  (selectedStatistic.value || "").trim(),
);

const selectedStatisticData = ref("count");

const metricOptions = {
  Overview: ["count", "percent", "median", "mean", "range"],
  Cases: ["event_count", "duration"],
  Resources: ["count", "percent"],
  Variants: ["count", "percent"],
};

watch(
  () => normalizedSelectedStatistic.value,
  (val) => {
    const allowed = metricOptions[val] || ["count"];
    if (!allowed.includes(selectedStatisticData.value)) {
      selectedStatisticData.value = allowed[0];
    }
  },
  { immediate: true },
);

const overviewHeaders = [
  "Activity",
  "Frequency",
  "Percentage",
  "Median Duration",
  "Average Duration",
  "Duration",
];
const casesHeaders = ["Case ID", "Events", "Start", "End", "Duration"];

const variantsHeaders = ["Variant", "Frequency", "Percentage"];
const resourcesHeaders = ["Resource", "Frequency", "Percentage"];

const selectedHeaders = computed(() => {
  switch (selectedStatistic.value) {
    case "Overview":
      return overviewHeaders;
    case "Cases":
      return casesHeaders;
    case "Variants":
      return variantsHeaders;
    case "Resources":
      return resourcesHeaders;
    default:
      return [];
  }
});

const formatDuration = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => formatDuration(v)).join(" - ");
  }

  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) {
    return value ?? "-";
  }

  const totalSeconds = Math.floor(seconds);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (secs || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
};
</script>
