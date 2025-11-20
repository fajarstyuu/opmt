<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6"
  >
    <div class="flex gap-6 h-[calc(100vh-3rem)]">
      <!-- Sidebar -->
      <DiscoverySidebar>
        <template #actions>
          <button
            class="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon
                points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
              ></polygon>
            </svg>
            Pilih Kriteria
          </button>
        </template>

        <template #stats>
          <div class="bg-white/50 rounded-lg p-3">
            <p class="text-xs text-gray-600 mb-1">Filter Aktif</p>
            <p class="text-sm font-medium text-gray-800">Belum ada filter</p>
          </div>

          <div class="bg-white/50 rounded-lg p-3">
            <p class="text-xs text-gray-600 mb-1">Total Events</p>
            <p class="text-2xl font-bold text-indigo-600">1,247</p>
          </div>

          <div class="bg-white/50 rounded-lg p-3">
            <p class="text-xs text-gray-600 mb-1">Cases</p>
            <p class="text-2xl font-bold text-purple-600">156</p>
          </div>
        </template>
      </DiscoverySidebar>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Process Model Visualization -->
        <div
          class="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 border-2 border-white/50 overflow-hidden flex flex-col"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Petri Net Model</h3>
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
            </div>
          </div>

          <!-- Petri Net Stands Here Coming Soon -->
          <div
            ref="cyContainer"
            class="w-full flex-1 min-h-[300px] overflow-auto"
          ></div>
        </div>

        <!-- Bottom Tabs -->
        <BottomTabs v-model="selectedTab" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import DiscoverySidebar from "~/components/DiscoverySidebar.vue";
import BottomTabs from "~/components/BottomTabs.vue";
import cytoscape from "cytoscape";

// Use a minimal/plain layout for this page (so default layout is NOT applied)
definePageMeta({ layout: "plain" });

const selectedTab = ref("discovery");
const zoomLevel = ref(1); // Keeping this line for reference, but it will be replaced by direct control of cyInstance

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
const { data } = useFile();

let cyInstance = null;
const mountedRef = ref(false);

function createCytoscape(elements) {
  if (!cyContainer.value) return null;

  // destroy existing instance if present
  if (cyInstance && cyInstance.destroy) {
    try {
      cyInstance.destroy();
    } catch (e) {
      /* ignore */
    }
  }

  cyInstance = cytoscape({
    container: cyContainer.value,
    elements,
    style: [
      {
        selector: 'node[type="place"]',
        style: {
          "background-color": "#60A5FA",
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
    } else if (n.id) {
      norm.push({ data: n });
    } else {
      // unexpected shape, try to wrap
      norm.push({ data: n });
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
      norm.push({ data: { id, source: e.source, target: e.target, ...e } });
    } else {
      // fallback wrap
      norm.push({ data: e });
    }
  }

  return norm;
}

watch(
  () => data.value,
  (val) => {
    console.log("Data changed, updating Cytoscape:", val);
    // if component not mounted yet, we'll let onMounted handle creation
    if (!mountedRef.value) {
      console.log("Cytoscape: not mounted yet, skipping creation");
      return;
    }

    const payload = extractPayload(val);
    if (!payload) return;

    const nodes = Array.isArray(payload.nodes) ? payload.nodes : [];
    const edges = Array.isArray(payload.edges) ? payload.edges : [];
    const elements = normalizeElements(nodes, edges);

    console.log("Creating cytoscape with elements count:", elements.length);
    const inst = createCytoscape(elements);
    if (inst) {
      console.log(
        "Cytoscape created. nodes:",
        inst.nodes().length,
        "edges:",
        inst.edges().length
      );
      if (inst.nodes().length === 0) {
        console.warn(
          "Cytoscape has zero nodes after creation. Sample elements:",
          elements.slice(0, 10)
        );
      } else {
        // fit to container
        try {
          inst.fit();
        } catch (e) {
          /* ignore fit errors */
        }
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  mountedRef.value = true;
  // if data was already present, trigger creation now
  const val = data.value;
  const cp = extractPayload(val);
  if (cp) {
    const nodes = Array.isArray(cp.nodes) ? cp.nodes : [];
    const edges = Array.isArray(cp.edges) ? cp.edges : [];
    const elements = normalizeElements(nodes, edges);
    createCytoscape(elements);
  }
});
</script>

<style scoped>
/* Custom styling jika diperlukan */
</style>
