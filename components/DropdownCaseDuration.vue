<template>
  <div>
    <label class="block text-gray-700 font-bold mb-2">{{ label }}</label>
    <div class="flex flex-row">
      <input
        :value="inputValue"
        @input="$emit('update:inputValue', $event.target.value)"
        type="number"
        min="0"
        class="w-3/5 accent-transparent bg-slate-100 px-2 py-1 rounded-tl-lg rounded-bl-lg"
      />
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-2/5 bg-slate-400 hover:bg-slate-300 text-white font-medium text-xs py-3 px-2 pr-10 rounded-tr-lg rounded-br-lg shadow-sm transition-all duration-200"
      >
        <option
          v-for="duration in caseDuration"
          :key="duration.value"
          :value="duration.value"
        >
          {{ duration.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "Case Duration",
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
  inputValue: {
    type: Number,
    default: 0,
  },
  caseDuration: {
    type: Array,
    default: () => [],
  },
});

watch(
  () => props.inputValue,
  (newVal) => {
    if (!newVal) {
      emit("update:inputValue", 0);
    }
  }
);

const emit = defineEmits(["update:modelValue", "update:inputValue"]);
</script>
