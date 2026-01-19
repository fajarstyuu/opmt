<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
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
  modelValue: {
    type: String,
  },
  statisticMode: {
    type: String,
    default: null,
  },
  dataset: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { selectedStatistic } = useStatistic();

const effectiveStatisticMode = computed(() => {
  return props.statisticMode || selectedStatistic.value;
});

const chartSource = computed(() => {
  if (!props.dataset) return null;
  if (props.dataset.model_statistics) {
    return props.dataset.model_statistics;
  }
  return props.dataset;
});

const normalizedStatisticMode = computed(() =>
  (effectiveStatisticMode.value || "").trim()
);

const statisticTableData = computed(() => {
  const source = chartSource.value;
  if (!source) return [];
  switch (normalizedStatisticMode.value) {
    case "Overview":
      return source.events || [];
    case "Cases":
      return source.case || [];
    case "Variants":
      return source.variants || [];
    case "Resources":
      return source.resources || [];
    default:
      return [];
  }
});

console.log("statisticTableData in EventChart:", statisticTableData.value);

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  zoomPlugin
);

const optionalChartData = (label, data, suffix) => {
  const sorted = [...statisticTableData.value].sort((b, a) => {
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

const chartData = computed(() => {
  if (normalizedStatisticMode.value === "Overview") {
    switch (props.modelValue) {
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
  }

  if (normalizedStatisticMode.value === "Cases") {
    if (props.modelValue === "duration") {
      return optionalChartData("case_id", "duration");
    }
    return optionalChartData("case_id", "event_count");
  }

  if (normalizedStatisticMode.value === "Variants") {
    if (props.modelValue === "percent") {
      return optionalChartData("variant", "percent");
    }
    return optionalChartData("variant", "count");
  }

  if (normalizedStatisticMode.value === "Resources") {
    if (props.modelValue === "percent") {
      return optionalChartData("resource", "percent");
    }
    return optionalChartData("resource", "count");
  }

  return { labels: [], datasets: [] };
});

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
  scales: {
    x: {
      ticks: {
        display: false,
      },
    },
  },
});
</script>
