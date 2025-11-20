<template>
  <div class="overflow-scroll rounded-3xl space-y-8">
    <div class="bg-white rounded-2xl p-6 shadow-md h-80">
      <Bar
        :data="chartData2"
        :options="chartOptions"
        :key="selectedStatistic.value"
      />
    </div>
    <table class="min-w-full bg-white rounded-2xl overflow-hidden shadow">
      <thead>
        <tr>
          <th v-for="value in selectedHeaders" class="px-4 py-2 border">
            {{ value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="selectedStatistic === 'Overview'">
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
              <td class="px-4 py-2 border">{{ row.median }}</td>
              <td class="px-4 py-2 border">{{ row.mean }}</td>
              <td class="px-4 py-2 border">{{ row.range }}</td>
            </tr>
          </template>
        </template>
        <template v-else-if="selectedStatistic === 'Cases'">
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
              <td class="px-4 py-2 border">{{ row.duration }}</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  plugins,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

const { selectedStatistic, statisticTableData } = useStatistic();

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  zoomPlugin
);

const chartData = reactive({
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Example",
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 39],
    },
  ],
});

const chartData2 = computed(() => ({
  labels:
    selectedStatistic.value === "Overview"
      ? statisticTableData.value.map((row) => row.activity)
      : statisticTableData.value.map((row) => row.case_id),
  datasets: [
    {
      label: "My First Dataset",
      data:
        selectedStatistic.value === "Overview"
          ? statisticTableData.value.map((row) => row.count)
          : statisticTableData.value.map((row) => row.event_count),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverOffset: 4,
    },
  ],
}));

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Statistic Chart",
    },
    zoom: {
      pan: {
        enabled: true,
        mode: "x",
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "x",
      },
    },
  },
});

const overviewHeaders = [
  "Activity",
  "Frequency",
  "Percentage",
  "Median Duration",
  "Average Duration",
  "Duration",
];
const casesHeaders = ["Case ID", "Events", "Start", "End", "Duration"];

const selectedHeaders = computed(() => {
  return selectedStatistic.value === "Overview"
    ? overviewHeaders
    : casesHeaders;
});
</script>
