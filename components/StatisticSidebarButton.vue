<template>
  <button
    @click="$emit('click', props.name)"
    class="w-full rounded-lg px-3 py-5 items-center justify-start flex flex-row space-x-2 hover:bg-white hover:backdrop-blur-lg focus:shadow-lg transition-all duration-200"
    :class="[
      props.isActive
        ? 'bg-white backdrop-blur-lg text-white shadow-lg'
        : 'bg-white/50 text-black shadow-sm',
    ]"
  >
    <Icon :name="props.icon" style="color: black" size="1.25rem" />
    <p class="text-xl font-medium text-black">{{ props.placeholder }}</p>
  </button>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Information Label",
  },
  icon: {
    type: String,
    default: "gis:earth",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
</script>
