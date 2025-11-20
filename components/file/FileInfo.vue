<template>
  <div
    class="w-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg px-6 py-4 shadow-lg overflow-scroll scrollbar-hidden"
  >
    <!-- Selected file info (shared state) -->
    <div>
      <p class="text-xs text-gray-600 mb-2">Selected Log File</p>
      <div v-if="fileInfo && fileInfo.name" class="bg-white/60 rounded-lg p-3">
        <p class="text-sm font-medium text-gray-800 truncate">
          {{ fileInfo.name }}
        </p>
        <p class="text-xs text-gray-600">Size: {{ prettySize }}</p>
        <div class="mt-3 flex gap-2">
          <button
            @click="reveal"
            class="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
          >
            Show
          </button>
          <button
            @click="clearFile"
            class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
          >
            Clear
          </button>
        </div>
      </div>
      <div v-else class="bg-white/30 rounded-lg p-3 text-xs text-gray-500">
        Tidak ada file dipilih
      </div>
    </div>
  </div>
</template>

<script setup>
const { fileInfo, clearFile } = useFile();

function reveal() {
  console.log("[DiscoverySidebar] fileInfo:", fileInfo.value);
}

const prettySize = computed(() => {
  if (!fileInfo || !fileInfo.value) return "";
  const size = fileInfo.value.size || 0;
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / (1024 * 1024)).toFixed(2) + " MB";
});
</script>
