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

          <!-- Petri Net Stands Here Coming Soon -->
        </div>

        <!-- Bottom Tabs -->
        <BottomTabs v-model="selectedTab" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DiscoverySidebar from "~/components/DiscoverySidebar.vue";
import BottomTabs from "~/components/BottomTabs.vue";

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
