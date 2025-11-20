<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6"
  >
    <div class="flex gap-6 h-[calc(100vh-3rem)]">
      <DiscoverySidebar> </DiscoverySidebar>

      <main class="flex-1 flex flex-col">
        <div
          class="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 border-2 border-white/50 overflow-hidden flex flex-col"
        >
          <slot />
        </div>
        <!-- Bottom Tabs -->
        <BottomTabs v-model="selectedTab" />
      </main>
    </div>
  </div>

  <!-- Page content -->
</template>

<script setup lang="ts">
const selectedTab = ref("discovery");
watch(selectedTab, (newVal) => {
  console.log("Selected Tab:", newVal);
});
</script>

<style scoped>
/* small adjustments */
</style>
