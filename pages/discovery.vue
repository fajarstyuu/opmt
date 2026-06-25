<template>
  <div class="flex flex-col h-full overflow-y-auto scrollbar-hidden">
    <!-- Toolbar -->
    <div
      class="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between lg:mb-6 flex-shrink-0"
    >
      <div
        class="flex gap-2 overflow-x-auto scrollbar-hidden snap-x snap-mandatory pb-1"
      >
        <button
          @click="zoomIn"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          Zoom In
        </button>
        <button
          @click="zoomOut"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          Zoom Out
        </button>
        <button
          @click="resetZoom"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          Reset
        </button>
        <button
          @click="handleDownload"
          :disabled="isDownloading"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isDownloading ? "Downloading..." : "Download" }}
        </button>
        <button
          @click="handleDownloadEventLog"
          :disabled="isDownloadingEventLog"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isDownloadingEventLog ? "Downloading..." : "Download Event Log" }}
        </button>
        <div class="flex-shrink-0 snap-start flex items-center gap-2">
          <span class="text-sm text-gray-600 whitespace-nowrap">Model:</span>
          <select
            v-model="selectedModelType"
            class="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="petrinet">Petrinet</option>
            <option value="dfg">DFG</option>
          </select>
        </div>
        <template v-if="selectedModelType === 'dfg'">
          <div class="flex-shrink-0 snap-start flex items-center gap-2">
            <span class="text-sm text-gray-600 whitespace-nowrap">Type:</span>
            <select
              v-model="selectedModelTypeDisplay"
              class="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="dur">Duration</option>
              <option value="freq">Frequency</option>
            </select>
          </div>
        </template>
      </div>
      <div
        class="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory pb-1"
      >
        <div class="flex-shrink-0 snap-start flex items-center gap-2">
          <span class="text-sm text-gray-600 whitespace-nowrap"
            >Algorithm:</span
          >
          <select
            v-model="selectedAlgorithmValue"
            class="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option
              v-for="option in algorithmOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div
          class="flex-shrink-0 snap-start bg-white px-4 py-2 rounded-xl border-2 flex flex-col gap-1 min-w-[180px] lg:min-w-[220px] text-xs"
        >
          <div class="flex items-center justify-between text-xs text-gray-600">
            <span>Noise Threshold</span>
            <span class="font-semibold text-gray-900">
              {{ formattedNoiseThreshold }}
            </span>
          </div>
          <input
            type="range"
            class="w-full accent-indigo-600"
            min="0"
            max="1"
            step="0.01"
            v-model.number="noiseThresholdValue"
          />
        </div>
        <button
          @click="handleDiscover"
          :disabled="isDiscovering"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg border-red-200 border-2 hover:bg-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isDiscovering ? "Discovering..." : "Discover!" }}
        </button>
        <button
          @click="handleEvaluate"
          :disabled="isEvaluating"
          class="flex-shrink-0 snap-start px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg border-green-200 border-2 hover:bg-green-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isEvaluating ? "Evaluating..." : "Evaluate" }}
        </button>
      </div>
    </div>

    <!-- Petrinet -->
    <div class="flex flex-row flex-1 space-x-4 min-h-[300px] lg:min-h-0">
      <div
        ref="cyContainer"
        class="w-full flex-1 min-h-[300px] overflow-auto"
      ></div>
    </div>
    <div
      class="mt-4 lg:mt-6 flex-shrink-0 bg-white/70 backdrop-blur-sm rounded-2xl p-4 lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:rounded-none shadow-md lg:shadow-none"
    >
      <h2 class="text-base font-semibold text-gray-800 mb-3">
        Evaluation Metrics
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div
          v-for="metric in conformanceMetrics"
          :key="metric.label"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <p class="text-gray-500 text-xs uppercase tracking-wide">
            {{ metric.label }}
          </p>
          <p class="text-lg font-semibold text-gray-900">
            {{ metric.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import cytoscape from "cytoscape";
import { useFilterSelection } from "~/composables/useModel";

const { data, downloadModel } = useFile();
const { selection: filterSelection } = useFilterSelection();

const algorithmOptions = [
  { label: "Inductive Miner", value: "inductive" },
  { label: "Heuristic Miner", value: "heuristic" },
  { label: "Alpha Miner", value: "alpha" },
];

const selectedAlgorithmValue = ref("inductive");
const noiseThresholdValue = ref(0);
watch(selectedAlgorithmValue, (newVal) => {
  console.log("Selected Algorithm changed to:", newVal);
});

const formattedNoiseThreshold = computed(() => {
  const value =
    typeof noiseThresholdValue.value === "number"
      ? noiseThresholdValue.value
      : 0;
  return value.toFixed(2);
});

const conformanceMetrics = computed(() => {
  const metrics = data.value?.petri_net?.conformance_metrics;
  const format = (val) =>
    typeof val === "number" && Number.isFinite(val) ? val.toFixed(3) : "N/A";

  return [
    {
      label: "Fitness",
      value: format(metrics?.fitness?.average_trace_fitness),
    },
    { label: "Precision", value: format(metrics?.precision) },
    { label: "Generalization", value: format(metrics?.generalization) },
    { label: "Simplicity", value: format(metrics?.simplicity) },
  ];
});

const selectedModelType = ref("petrinet");
const selectedModelTypeDisplay = ref("dur");

const zoomLevel = ref(1);

function zoomIn() {
  if (cyInstance && cyInstance.zoom) {
    try {
      const cur = cyInstance.zoom();
      cyInstance.zoom({ level: cur + 0.1, rendered: true });
    } catch (e) {
      /* ignore */
    }
  }
}

function zoomOut() {
  if (cyInstance && cyInstance.zoom) {
    try {
      const cur = cyInstance.zoom();
      cyInstance.zoom({ level: Math.max(0.1, cur - 0.1), rendered: true });
    } catch (e) {
      /* ignore */
    }
  }
}

function resetZoom() {
  if (cyInstance && cyInstance.fit) {
    try {
      cyInstance.fit();
    } catch (e) {
      /* ignore */
    }
  }
}

const cyContainer = ref(null);
const isDownloading = ref(false);
const isDownloadingEventLog = ref(false);
const isDiscovering = ref(false);
const isEvaluating = ref(false);
const sessionCookie = useCookie("session_id");
const initialSessionId = sessionCookie.value || "";
const discoveryModel = ref(null);

function getActiveSessionId() {
  return sessionCookie.value || initialSessionId;
}

let cyInstance = null;

function applyDfgEdgeVisuals(inst) {
  if (!inst) return;
  try {
    inst.edges().forEach((edge) => {
      const levelField =
        selectedModelTypeDisplay.value === "dur"
          ? "level_mean"
          : "level_frequency";
      // fallback if specific field empty
      const lvl = edge.data(levelField) || edge.data("level") || "rendah";
      let color = "#000000";
      let width = 2;
      if (lvl === "sedang") {
        color = "#dc7226"; // red-600
        width = 3;
      } else if (lvl === "tinggi") {
        color = "#DC2626";
        width = 5;
      }
      edge.css({ "line-color": color, "target-arrow-color": color, width });
    });
  } catch (e) {
    console.warn("applyDfgEdgeVisuals error", e);
  }
}

function createCytoscape(elements, type) {
  if (!cyContainer.value) return null;

  // destroy existing instance if present
  if (cyInstance && cyInstance.destroy) {
    try {
      cyInstance.destroy();
    } catch (e) {
      /* ignore */
    }
  }

  if (type === "dfg") {
    cyInstance = cytoscape({
      container: cyContainer.value,
      elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#FBBF24",
            label: (ele) => {
              const activity = ele.data("activity");
              const count = ele.data("count");

              if (selectedModelTypeDisplay.value === "freq") {
                return `${activity} (${count})`;
              } else {
                return activity;
              }
            },
            shape: "round-rectangle",
            width: 30,
            height: 30,
            "text-valign": "center",
            color: "#000000",
            "font-size": 10,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#9CA3AF",
            // Use generic label so we can switch between duration/frequency
            label: "data(label)",
            "target-arrow-color": "#9CA3AF",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "control-point-step-size": 60,
            "control-point-weight": 0.2,
            "edge-distances": "node-position",
          },
        },
      ],
    });
  } else {
    cyInstance = cytoscape({
      container: cyContainer.value,
      elements,
      style: [
        {
          selector: 'node[type="place"]',
          style: {
            "background-color": "#60A5FA",
            //label: "data(label)",
            shape: "ellipse",
            width: 30,
            height: 30,
            "text-valign": "center",
            color: "#000000",
            "font-size": 10,
          },
        },
        {
          selector: 'node[label="source"][type="place"]',
          style: {
            "background-color": "#ff1249",
            label: "data(label)",
            shape: "ellipse",
            width: 30,
            height: 30,
            "text-valign": "center",
            color: "#000000",
            "font-size": 10,
          },
        },
        {
          selector: 'node[label="sink"][type="place"]',
          style: {
            "background-color": "#ff1249",
            label: "data(label)",
            shape: "ellipse",
            width: 30,
            height: 30,
            "text-valign": "center",
            color: "#000000",
            "font-size": 10,
          },
        },
        {
          selector: 'node[type="transition"]',
          style: {
            "background-color": "#34D399",
            label: "data(label)",
            shape: "round-rectangle",
            width: 12,
            height: 30,
            "text-valign": "center",
            color: "#000000",
            "font-size": 8,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#9CA3AF",
            // label: "data(frequency)",
            "target-arrow-color": "#9CA3AF",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "control-point-step-size": 60,
            "control-point-weight": 0.2,
            "edge-distances": "node-position",
          },
        },
      ],
    });
  }

  // run layout
  const layout = cyInstance.layout({
    name: "breadthfirst",
    directed: true,
    padding: 10,
    spacingFactor: 1.5,
    fit: true,
    animate: true,
    animationDuration: 500,
    transform: (node, pos) => {
      // kalau kamu mau "source" selalu di paling atas
      if (node.data("label") === "source") pos.y -= 100;
      return pos;
    },
    // optional, bisa pakai rankDir "TB" untuk top-bottom
    // tapi hanya untuk layout eksternal seperti dagre
  });
  layout.run();

  return cyInstance;
}

// helper: extract nodes/edges from multiple possible response shapes
function extractPayload(val) {
  if (!val) return null;
  // Possible shapes we've seen:
  // - { cytoscape: { nodes, edges } }
  // - { data: { cytoscape: { nodes, edges } } }
  // - { data: { nodes, edges } }
  // - { nodes, edges }
  if (val.cytoscape && (val.cytoscape.nodes || val.cytoscape.edges))
    return val.cytoscape;
  if (
    val.data &&
    val.data.cytoscape &&
    (val.data.cytoscape.nodes || val.data.cytoscape.edges)
  )
    return val.data.cytoscape;
  if (val.data && (val.data.nodes || val.data.edges))
    return { nodes: val.data.nodes, edges: val.data.edges };
  if (val.nodes || val.edges) return { nodes: val.nodes, edges: val.edges };
  return null;
}

function normalizeElements(nodes, edges) {
  const norm = [];

  // nodes may already be in cytoscape element format ({ data: { id, label } }) or plain objects
  for (const n of nodes) {
    if (!n) continue;
    if (n.data && n.data.id) {
      norm.push(n);
      continue;
    }
    // If node has id already
    if (n.id) {
      // ensure label exists
      norm.push({ data: { label: n.label || n.id, ...n } });
      continue;
    }
    // Handle new DFG shape { activity: 'Analyze Request', count: 123 }
    if (n.activity && !n.id) {
      norm.push({
        data: {
          id: n.activity,
          label: n.activity,
          count: n.count ?? 0,
          // preserve original fields
          ...n,
        },
      });
      continue;
    }
    // Fallback: wrap entire object, attempt to derive id/label if possible
    const derivedId = n.label || n.name || n.title || undefined;
    if (derivedId) {
      norm.push({ data: { id: derivedId, label: derivedId, ...n } });
    } else {
      // last resort: generate random id so Cytoscape will render something
      const randomId = `n_${Math.random().toString(36).slice(2, 9)}`;
      norm.push({ data: { id: randomId, label: n.label || randomId, ...n } });
    }
  }

  for (const e of edges) {
    if (!e) continue;
    if (e.data && e.data.id) {
      norm.push(e);
    } else if (e.id && (e.source || e.target)) {
      norm.push({ data: e });
    } else if (e.source && e.target) {
      // missing id, create one
      const id = `e_${Math.random().toString(36).slice(2, 9)}`;
      // Ensure label preference: mean_string -> median_string -> frequency
      const label = e.mean_string || e.median_string || e.frequency || e.label;
      norm.push({
        data: { id, source: e.source, target: e.target, label, ...e },
      });
    } else {
      // fallback wrap
      norm.push({ data: e });
    }
  }

  return norm;
}

function extractGraphFromData(val, type) {
  if (!val) return null;

  if (type === "petrinet") {
    return val.petri_net?.cytoscape || val.petri_net || null;
  }

  if (type === "dfg") {
    return val.dfg?.cytoscape || val.dfg || null;
  }

  return null;
}

function rebuildGraph() {
  const val = data.value;
  const type = selectedModelType.value;
  const display = selectedModelTypeDisplay.value;

  console.log("Rebuilding Cytoscape with state:", {
    type,
    display,
    hasContainer: Boolean(cyContainer.value),
    hasData: Boolean(val),
  });

  if (!cyContainer.value || !val) {
    return;
  }

  const graphSource = extractGraphFromData(val, type) || extractPayload(val);
  if (!graphSource) return;

  const nodes = Array.isArray(graphSource.nodes) ? graphSource.nodes : [];
  const edges = Array.isArray(graphSource.edges) ? graphSource.edges : [];
  const elements = normalizeElements(nodes, edges);

  console.log("Creating cytoscape with elements count:", elements.length);
  const inst = createCytoscape(elements, type);
  if (!inst) return;

  console.log(
    "Cytoscape created. nodes:",
    inst.nodes().length,
    "edges:",
    inst.edges().length,
  );

  if (type === "dfg") {
    try {
      inst.edges().forEach((edge) => {
        if (selectedModelTypeDisplay.value === "dur") {
          const label =
            edge.data("mean_string") || edge.data("median_string") || "";
          edge.data("label", label);
        } else {
          const label =
            edge.data("frequency")?.toString() || edge.data("label") || "";
          edge.data("label", label);
        }
      });
      applyDfgEdgeVisuals(inst);
    } catch (e) {
      console.warn("Failed updating DFG edge labels", e);
    }
  }

  if (inst.nodes().length === 0) {
    console.warn(
      "Cytoscape has zero nodes after creation. Sample elements:",
      elements.slice(0, 10),
    );
  } else {
    try {
      inst.fit();
    } catch (e) {
      /* ignore fit errors */
    }
  }
}

watch(
  [data, selectedModelType, selectedModelTypeDisplay],
  () => {
    rebuildGraph();
  },
  { immediate: true },
);

onMounted(() => {
  rebuildGraph();
});

async function handleDownload() {
  if (isDownloading.value) return;
  isDownloading.value = true;
  try {
    await downloadModel({
      session_id: getActiveSessionId(),
      algorithm: selectedAlgorithmValue.value || "inductive",
      noiseThreshold: clampNoise(noiseThresholdValue.value),
      variantsCoverage: fallbackPercentage(
        filterSelection.value.variantsCoverage,
      ),
      eventCoverage: fallbackPercentage(filterSelection.value.eventCoverage),
      caseDurationMin: sanitizeNumber(filterSelection.value.caseDurationMin),
      caseDurationMax: sanitizeNumber(filterSelection.value.caseDurationMax),
      numberOfEventsMin: sanitizeNumber(filterSelection.value.minCaseSize),
      numberOfEventsMax: sanitizeNumber(filterSelection.value.maxCaseSize),
    });
  } catch (error) {
    console.error("Failed to download model", error);
  } finally {
    isDownloading.value = false;
  }
}

async function handleDownloadEventLog() {
  if (isDownloadingEventLog.value) return;
  const activeSessionId = getActiveSessionId();
  if (!activeSessionId) {
    console.warn("Session ID is required before downloading event log.");
    return;
  }

  isDownloadingEventLog.value = true;
  try {
    const response = await $fetch.raw("/api/download-event-log", {
      method: "POST",
      body: {
        session_id: activeSessionId,
      },
      responseType: "arrayBuffer",
    });

    const arrayBuffer = response._data || new ArrayBuffer(0);
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const blob = new Blob([arrayBuffer], { type: contentType });

    const disposition = response.headers.get("content-disposition");
    const filename =
      disposition?.match(/filename="?([^";]+)"?/)?.[1] ||
      `event_log_${Date.now()}.xes`;

    triggerBrowserDownload(blob, filename);
  } catch (error) {
    console.error("Failed to download event log", error);
  } finally {
    isDownloadingEventLog.value = false;
  }
}

const handleDiscover = async () => {
  if (isDiscovering.value) return;

  const algorithm = selectedAlgorithmValue.value || "inductive";
  const thresholdRaw =
    typeof noiseThresholdValue.value === "number"
      ? noiseThresholdValue.value
      : 0;
  const noiseThreshold = Math.min(1, Math.max(0, thresholdRaw));

  const activeSessionId = getActiveSessionId();
  if (!activeSessionId) {
    console.warn("Session ID is required before discovering.");
    return;
  }

  isDiscovering.value = true;
  try {
    console.log("Discovering...", {
      sessionId: activeSessionId,
      algorithm,
      noiseThreshold,
    });
    const response = await discoverModel(
      activeSessionId,
      algorithm,
      noiseThreshold,
    );
    console.log("Discovery complete.", response);

    const payload = response?.data;
    if (!payload) {
      console.warn("Discovery did not return any data payload");
      return;
    }

    discoveryModel.value = payload.petri_net || null;
    data.value = payload;
    selectedModelType.value = "petrinet";
    rebuildGraph();
  } catch (error) {
    console.error("Failed to discover", error);
  } finally {
    isDiscovering.value = false;
  }
};

const handleEvaluate = async () => {
  if (isEvaluating.value) return;

  const activeSessionId = getActiveSessionId();
  if (!activeSessionId) {
    console.warn("Session ID is required before evaluating.");
    return;
  }

  const algorithm = selectedAlgorithmValue.value || "inductive";
  const thresholdRaw =
    typeof noiseThresholdValue.value === "number"
      ? noiseThresholdValue.value
      : 0;
  const noiseThreshold = clampNoise(thresholdRaw);
  const variantsCoverageRatio = percentageToRatio(
    filterSelection.value.variantsCoverage,
    1,
  );
  const eventsCoverageRatio = percentageToRatio(
    filterSelection.value.eventCoverage,
    1,
  );

  isEvaluating.value = true;
  console.log("Evaluating conformance...", {
    sessionId: activeSessionId,
    algorithm,
    noiseThreshold,
    variantsCoverageRatio,
    eventsCoverageRatio,
    caseDurationMin: filterSelection.value.caseDurationMin,
    caseDurationMax: filterSelection.value.caseDurationMax,
    numberOfEventsMin: filterSelection.value.minCaseSize,
    numberOfEventsMax: filterSelection.value.maxCaseSize,
  });
  try {
    const response = await $fetch("/api/conformance", {
      method: "POST",
      body: {
        session_id: activeSessionId,
        model: algorithm,
        noise_threshold: noiseThreshold,
        variants_coverage: variantsCoverageRatio,
        events_coverage: eventsCoverageRatio,
        min_case_duration: sanitizeNumber(
          filterSelection.value.caseDurationMin,
        ),
        max_case_duration: sanitizeNumber(
          filterSelection.value.caseDurationMax,
        ),
        min_case_size: sanitizeNumber(filterSelection.value.minCaseSize),
        max_case_size: sanitizeNumber(filterSelection.value.maxCaseSize),
      },
    });

    const metrics = response?.data;
    if (!metrics) {
      console.warn("Conformance evaluation did not return metrics data");
      return;
    }

    const current = data.value || {};
    data.value = {
      ...current,
      petri_net: {
        ...(current?.petri_net || {}),
        conformance_metrics: metrics,
      },
    };
  } catch (error) {
    console.error("Failed to evaluate conformance", error);
  } finally {
    isEvaluating.value = false;
  }
};

const discoverModel = async (sessionId, modelName, noiseThreshold) => {
  const payload = {
    session_id: sessionId,
    model_name: modelName,
    noise_threshold: noiseThreshold,
  };
  try {
    const res = await $fetch("/api/discover", {
      method: "POST",
      body: payload,
    });
    console.log("Discovery response:", res);
    return res;
  } catch (error) {
    console.error("Failed to discover", error);
    throw error;
  }
};

function fallbackPercentage(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return 100;
}

function sanitizeNumber(value) {
  if (typeof value !== "number") return undefined;
  if (!Number.isFinite(value)) return undefined;
  return value;
}

function percentageToRatio(value, fallback = 1) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  const ratio = value / 100;
  if (ratio < 0) return 0;
  if (ratio > 1) return 1;
  return ratio;
}

function clampNoise(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function triggerBrowserDownload(blob, filename) {
  if (!process.client) return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<style scoped>
/* Custom styling jika diperlukan */
</style>
