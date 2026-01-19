<template>
  <div class="flex items-center justify-between mb-6">
    <div class="flex gap-2">
      <button
        @click="zoomIn"
        class="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
      >
        Zoom In
      </button>
      <button
        @click="zoomOut"
        class="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
      >
        Zoom Out
      </button>
      <button
        @click="resetZoom"
        class="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
      >
        Reset
      </button>
      <button
        @click="handleDownload"
        :disabled="isDownloading"
        class="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ isDownloading ? "Downloading..." : "Download" }}
      </button>
    </div>
    <div class="flex flex-row gap-4">
      <template v-if="selectedModelType === 'dfg'">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Model:</span>
          <select
            v-model="selectedModelTypeDisplay"
            class="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="dur">Duration</option>
            <option value="freq">Frequency</option>
          </select>
        </div>
      </template>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Model:</span>
        <select
          v-model="selectedModelType"
          class="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="petrinet">Petrinet</option>
          <option value="dfg">DFG</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Petrinet -->
  <div class="flex flex-row h-full space-x-4">
    <div
      ref="cyContainer"
      class="w-full flex-1 min-h-[300px] overflow-auto"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import cytoscape from "cytoscape";

const { data, downloadModel } = useFile();

const selectedModelType = ref("petrinet");
const selectedModelTypeDisplay = ref("dur");

function removeMilliseconds(str) {
  return str.includes(".") ? str.split(".")[0] : str;
}

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
    inst.edges().length
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
      elements.slice(0, 10)
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
  { immediate: true }
);

onMounted(() => {
  rebuildGraph();
});

async function handleDownload() {
  if (isDownloading.value) return;
  isDownloading.value = true;
  try {
    await downloadModel();
  } catch (error) {
    console.error("Failed to download model", error);
  } finally {
    isDownloading.value = false;
  }
}
</script>

<style scoped>
/* Custom styling jika diperlukan */
</style>
