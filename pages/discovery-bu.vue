<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6"
  >
    <div class="flex gap-6 h-[calc(100vh-3rem)]">
      <!-- Sidebar -->
      <div
        class="w-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg flex-shrink-0"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-6">
          Filtering Event Log
        </h2>

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

        <div class="mt-6 space-y-3">
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
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Process Model Visualization -->
        <div
          class="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 border-2 border-white/50"
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

          <!-- Petri Net Diagram -->
          <div
            class="flex items-center justify-center h-full border-4 border-indigo-400 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 overflow-auto"
          >
            <svg
              viewBox="0 0 800 350"
              class="w-full max-w-4xl transition-transform duration-300"
              :style="{ transform: `scale(${zoomLevel})` }"
            >
              <!-- Start Place P1 -->
              <circle
                cx="100"
                cy="175"
                r="35"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
              />
              <circle cx="100" cy="175" r="12" fill="#4f46e5" />
              <text
                x="100"
                y="230"
                text-anchor="middle"
                fill="#374151"
                font-size="18"
                font-weight="bold"
              >
                P1
              </text>

              <!-- Transition T1 -->
              <rect
                x="180"
                y="155"
                width="40"
                height="80"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
                rx="4"
              />
              <text
                x="200"
                y="205"
                text-anchor="middle"
                fill="#374151"
                font-size="18"
                font-weight="bold"
              >
                T1
              </text>

              <!-- Place P2 -->
              <circle
                cx="320"
                cy="120"
                r="35"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
              />
              <text
                x="320"
                y="175"
                text-anchor="middle"
                fill="#374151"
                font-size="18"
                font-weight="bold"
              >
                P2
              </text>

              <!-- Place P3 -->
              <circle
                cx="320"
                cy="280"
                r="35"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
              />
              <circle cx="310" cy="275" r="12" fill="#4f46e5" />
              <circle cx="330" cy="285" r="12" fill="#4f46e5" />
              <text
                x="320"
                y="335"
                text-anchor="middle"
                fill="#374151"
                font-size="18"
                font-weight="bold"
              >
                P3
              </text>

              <!-- Transition T2 -->
              <rect
                x="480"
                y="155"
                width="40"
                height="80"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
                rx="4"
              />
              <text
                x="500"
                y="205"
                text-anchor="middle"
                fill="#374151"
                font-size="18"
                font-weight="bold"
              >
                T2
              </text>

              <!-- End Place P4 -->
              <circle
                cx="640"
                cy="175"
                r="35"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
              />
              <circle
                cx="640"
                cy="175"
                r="28"
                fill="white"
                stroke="#4f46e5"
                stroke-width="3"
              />
              <circle cx="640" cy="175" r="12" fill="#4f46e5" />
              <text
                x="640"
                y="230"
                text-anchor="middle"
                fill="#374151"
                font-size="18"
                font-weight="bold"
              >
                P4
              </text>

              <!-- Arrows -->
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#6366f1" />
                </marker>
              </defs>

              <line
                x1="135"
                y1="175"
                x2="180"
                y2="185"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
              />
              <line
                x1="220"
                y1="170"
                x2="285"
                y2="135"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
              />
              <line
                x1="220"
                y1="220"
                x2="285"
                y2="265"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
              />
              <line
                x1="355"
                y1="130"
                x2="480"
                y2="170"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
              />
              <line
                x1="355"
                y1="270"
                x2="480"
                y2="220"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
              />
              <line
                x1="520"
                y1="190"
                x2="605"
                y2="180"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
              />
              <path
                d="M 640 210 Q 640 320, 370 320 Q 100 320, 100 210"
                fill="none"
                stroke="#6366f1"
                stroke-width="2.5"
                marker-end="url(#arrowhead)"
                stroke-dasharray="5,5"
              />
            </svg>
          </div>
        </div>

        <!-- Bottom Tabs -->
        <div class="flex gap-4">
          <button
            @click="selectedTab = 'discovery'"
            :class="[
              'flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md',
              selectedTab === 'discovery'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white transform scale-105'
                : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white',
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Discovery
            </div>
          </button>

          <button
            @click="selectedTab = 'statistics'"
            :class="[
              'flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md',
              selectedTab === 'statistics'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white transform scale-105'
                : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white',
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Statistics
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedTab = ref("discovery");
const zoomLevel = ref(1);

function zoomIn() {
  if (zoomLevel.value < 1.5) {
    zoomLevel.value += 0.1;
  }
}

function zoomOut() {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.1;
  }
}

function resetZoom() {
  zoomLevel.value = 1;
}
</script>

<style scoped>
/* Custom styling jika diperlukan */
</style>
