<template>
  <div class="flex gap-4">
    <button
      @click="select('discovery')"
      :class="[
        'flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md',
        selected === 'discovery'
          ? 'bg-blue-400 text-white'
          : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white',
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <slot name="discovery-icon">
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
        </slot>
        <slot name="discovery-label">Discovery</slot>
      </div>
    </button>

    <button
      @click="select('statistics')"
      :class="[
        'flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md',
        selected === 'statistics'
          ? 'bg-blue-400 text-white'
          : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white',
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <slot name="statistics-icon">
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
        </slot>
        <slot name="statistics-label">Statistics</slot>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: "discovery" },
});
const emit = defineEmits(["update:modelValue"]);

const selected = ref(props.modelValue);

function select(tab: string) {
  selected.value = tab;
  emit("update:modelValue", tab);
}
</script>

<style scoped>
/* small visual tweaks if needed */
</style>
