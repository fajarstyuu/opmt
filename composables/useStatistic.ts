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

interface StatisticVariants {
  variant: string;
  count: number;
  percent: number;
}

interface StatisticResource {
  resource: string;
  count: number;
  percent: number;
}

interface StatisticGeneral {
  number_of_places: number;
  number_of_transitions: number;
  number_of_arcs: number;
  noise_threshold_used: number;
  number_of_cases: number;
  number_of_variants: number;
  number_of_events: number;
  start_time: string;
  end_time: string;
  median_case_duration_seconds: number;
  mean_case_duration_seconds: number;
}

type StatisticRow =
  | StatisticEvent
  | StatisticCase
  | StatisticVariants
  | StatisticResource;

import { computed } from "vue";

interface StatisticPayload {
  events?: StatisticEvent[];
  case?: StatisticCase[];
  variants?: StatisticVariants[];
  resources?: StatisticResource[];
  general?: StatisticGeneral;
}

interface StatisticResponse {
  code: number;
  message: string;
  data?: StatisticPayload;
}

const EMPTY_MODEL_STATISTICS = {
  events: [] as StatisticEvent[],
  case: [] as StatisticCase[],
  variants: [] as StatisticVariants[],
  resources: [] as StatisticResource[],
};

export const useStatistic = () => {
  const selectedStatistic = useState<string>(
    "selectedStatistic",
    () => "Overview"
  );

  const sessionCookie = useCookie<string | null>("session_id");
  const sessionId = computed(() => sessionCookie.value ?? "");

  const statisticResponse = useState<StatisticResponse | null>(
    "statisticResponse",
    () => null
  );
  const statisticPending = useState<boolean>("statisticPending", () => false);
  const statisticError = useState<any>("statisticError", () => null);
  const lastFetchedSession = useState<string | null>(
    "statisticLastSession",
    () => null
  );
  const statisticFetchPromise = useState<Promise<void> | null>(
    "statisticFetchPromise",
    () => null
  );

  const fetchStatistic = async (options: { force?: boolean } = {}) => {
    const force = options.force ?? false;
    if (!sessionId.value) {
      statisticResponse.value = null;
      lastFetchedSession.value = null;
      return;
    }

    if (
      !force &&
      lastFetchedSession.value === sessionId.value &&
      statisticResponse.value
    ) {
      return;
    }

    if (statisticFetchPromise.value) {
      return statisticFetchPromise.value;
    }

    statisticPending.value = true;
    statisticError.value = null;

    const fetchPromise = $fetch<StatisticResponse>("/api/statistic", {
      method: "POST",
      body: {
        session_id: sessionId.value,
        filtered: true,
      },
    })
      .then((response) => {
        statisticResponse.value = response;
        lastFetchedSession.value = sessionId.value;
      })
      .catch((err) => {
        statisticError.value = err;
        throw err;
      })
      .finally(() => {
        statisticPending.value = false;
        statisticFetchPromise.value = null;
      });

    statisticFetchPromise.value = fetchPromise;
    return fetchPromise;
  };

  const modelStatistics = computed(() => {
    const stats = statisticResponse.value?.data ?? {};
    return {
      events: stats.events ?? EMPTY_MODEL_STATISTICS.events,
      case: stats.case ?? EMPTY_MODEL_STATISTICS.case,
      variants: stats.variants ?? EMPTY_MODEL_STATISTICS.variants,
      resources: stats.resources ?? EMPTY_MODEL_STATISTICS.resources,
    };
  });

  const generalStatistics = computed<StatisticGeneral | null>(() => {
    return statisticResponse.value?.data?.general ?? null;
  });

  const statisticTableData = computed<StatisticRow[]>(() => {
    if (selectedStatistic.value === "Overview") {
      return modelStatistics.value.events;
    } else if (selectedStatistic.value === "Cases") {
      return modelStatistics.value.case;
    } else if (selectedStatistic.value === "Variants") {
      return modelStatistics.value.variants;
    } else if (selectedStatistic.value === "Resources") {
      return modelStatistics.value.resources;
    } else {
      return [];
    }
  });

  function setSelectedStatistic(statistic: string) {
    selectedStatistic.value = statistic;
  }

  return {
    selectedStatistic,
    setSelectedStatistic,
    statisticTableData,
    statisticPending,
    statisticError,
    fetchStatistic,
    generalStatistics,
  };
};
