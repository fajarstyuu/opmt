<template>
  <div class="w-full bg-white/50 rounded-lg p-3">
    <p class="text-xs text-gray-600 mb-1">{{ props.placeholder }}</p>
    <p class="text-2xl font-bold text-indigo-600">{{ props.content }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: "Information Label",
  },
  content: {
    type: Number,
    default: 0,
  },
});
</script>
