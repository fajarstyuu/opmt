<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
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

const props = defineProps({
  selectedStatisticData: {
    type: String,
  },
});

const emit = defineEmits(["update:selectedStatisticData"]);

const { selectedStatistic, statisticTableData } = useStatistic();

console.log("statisticTableData in StatisticChart:", statisticTableData.value);

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  zoomPlugin
);

// const chartData = computed(() => ({
//   labels:
//     selectedStatistic.value === "Overview"
//       ? statisticTableData.value.map((row) => row.activity)
//       : statisticTableData.value.map((row) => row.case_id),
//   datasets: [
//     {
//       label: "My First Dataset",
//       data:
//         selectedStatistic.value === "Overview"
//           ? statisticTableData.value.map((row) => row.count)
//           : statisticTableData.value.map((row) => row.event_count),
//       backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//       hoverOffset: 4,
//     },
//   ],
// }));

const optionalChartData = (label, data, suffix) => {
  const sorted = [...statisticTableData.value].sort((a, b) => {
    return b[data] - a[data];
  });
  return {
    labels: sorted.map((row) => row[label]),
    datasets: [
      {
        data: sorted.map((row) => row[data]),
        backgroundColor: ["#FF6384"],
        hoverOffset: 4,
      },
    ],
  };
};

const normalizedSelectedStatistic = computed(() =>
  (selectedStatistic.value || "").trim()
);

const chartData = computed(() => {
  switch (normalizedSelectedStatistic.value) {
    case "Overview":
      switch (props.selectedStatisticData) {
        case "percent":
          return optionalChartData("activity", "percent");
        case "range":
          return optionalChartData("activity", "range");
        case "median":
          return optionalChartData("activity", "median");
        case "mean":
          return optionalChartData("activity", "mean");
        default:
          return optionalChartData("activity", "count");
      }
    case "Cases":
      if (props.selectedStatisticData === "duration") {
        return optionalChartData("case_id", "duration");
      }
      return optionalChartData("case_id", "event_count");
    case "Resources":
      if (props.selectedStatisticData === "percent") {
        return optionalChartData("resource", "percent");
      }
      return optionalChartData("resource", "count");
    case "Variants":
      if (props.selectedStatisticData === "percent") {
        return optionalChartData("variant", "percent");
      }
      return optionalChartData("variant", "count");
    default:
      return { labels: [], datasets: [] };
  }
});

const chartOptions = computed(() => ({
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
  scales: {
    x: {
      ticks: {
        display: normalizedSelectedStatistic.value !== "Variants",
      },
    },
  },
}));
</script>
