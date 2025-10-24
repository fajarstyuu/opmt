<template>
  <div
    class="w-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg flex-shrink-0"
  >
    <h2 class="text-xl font-bold text-gray-800 mb-6">Filtering Event Log</h2>

    <slot name="actions">
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
    </slot>

    <div class="mt-6 space-y-3">
      <slot name="stats">
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
      </slot>
    </div>
  </div>
</template>

<script setup>
// Pure presentational component; no props required for now.
</script>

<style scoped>
/* component-specific styles if needed */
</style>
