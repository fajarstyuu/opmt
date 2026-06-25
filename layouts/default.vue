<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-3 md:p-6"
  >
    <!-- Mobile hamburger button -->
    <button
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-200"
      @click="sidebarOpen = true"
    >
      <Icon name="mdi:menu" class="text-2xl text-gray-700" />
    </button>

    <!-- Mobile overlay -->
    <Transition name="overlay">
      <div
        v-if="sidebarOpen"
        class="lg:hidden fixed inset-0 bg-black/40 z-40"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Mobile slide-in sidebar -->
    <Transition name="slide">
      <div
        v-if="sidebarOpen"
        class="lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 shadow-2xl overflow-y-auto scrollbar-hidden p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-bold text-gray-800">Menu</span>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            @click="sidebarOpen = false"
          >
            <Icon name="mdi:close" class="text-xl text-gray-600" />
          </button>
        </div>
        <DiscoverySidebar @navigate="sidebarOpen = false" />
      </div>
    </Transition>

    <div
      class="flex gap-4 md:gap-6 h-[calc(100vh-1.5rem)] md:h-[calc(100vh-3rem)]"
    >
      <!-- Desktop sidebar -->
      <div class="hidden lg:flex lg:flex-col flex-shrink-0 h-full min-h-0">
        <DiscoverySidebar />
      </div>

      <main class="flex-1 flex flex-col min-w-0">
        <div
          class="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8 pb-12 md:pb-16 mb-4 md:mb-6 border-2 border-white/50 overflow-hidden flex flex-col"
        >
          <slot />
        </div>
        <!-- Bottom Tabs -->
        <BottomTabs v-model="selectedTab" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedTab = ref("statistics");
const sidebarOpen = ref(false);

const route = useRoute();
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  },
);

watch(selectedTab, (newVal) => {
  console.log("Selected Tab:", newVal);
});
</script>

<style scoped>
/* Slide-in from left */
.slide-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-leave-active {
  transition: transform 0.2s ease-in;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Overlay fade */
.overlay-enter-active {
  transition: opacity 0.3s ease-out;
}
.overlay-leave-active {
  transition: opacity 0.2s ease-in;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
