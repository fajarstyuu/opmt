interface StatisticEvent {
  activity: string;
  count: number;
  percent: number;
  median: number;
  mean: number;
  range: number;
}

interface StatisticCase {
  case_id: string;
  start_time: string;
  end_time: string;
  event_count: number;
  duration: number;
}

type StatisticRow = StatisticEvent | StatisticCase;

import { computed } from "vue";
const { data } = useFile();

export const useStatistic = () => {
  const selectedStatistic = useState<string>(
    "selectedStatistic",
    () => "Overview"
  );

  const statisticTableData = computed<StatisticRow[]>(() => {
    if (selectedStatistic.value === "Overview") {
      return data.value?.model_statistics.events || [];
    }
    if (selectedStatistic.value === "Cases") {
      return data.value?.model_statistics.case || [];
    }
    return [];
  });

  function setSelectedStatistic(statistic: string) {
    selectedStatistic.value = statistic;
  }

  return {
    selectedStatistic,
    setSelectedStatistic,
    statisticTableData,
  };
};
