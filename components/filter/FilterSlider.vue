<template>
  <div class="mt-2 space-y-1 w-full flex flex-col items-center justify-center">
    <div class="bg-white rounded-xl px-6 py-4 w-full">
      <div>
        <label class="block text-gray-700 font-bold mb-2">{{
          insiderPlaceholder
        }}</label>
        <input
          type="range"
          class="w-full accent-indigo-600"
          :min="min"
          :max="max"
          :step="step"
          v-model.number="value"
          @input="emitValue"
        />
      </div>
      <div class="flex items-center justify-between text-gray-500 mt-2">
        <div class="text-sm">
          <span class="font-medium">
            {{ displayCurrentValue }}
          </span>
        </div>
        <div class="text-xs flex gap-4">
          <span>{{ displayMaxValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { secondToDayString } from "~/utils/format";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Default placeholder",
  },
  insiderPlaceholder: {
    type: String,
    default: "Default insider placeholder",
  },
  min: {
    type: [Number, String],
    default: 0,
  },
  max: {
    type: [Number, String],
    default: 100,
  },
  step: {
    type: [Number, String],
    default: 1,
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
  valueFormat: {
    type: String,
    default: "",
  },
  format: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// normalize numeric props to numbers
const toNumber = (v) => (typeof v === "string" ? parseFloat(v) : v);

const value = ref(toNumber(props.modelValue ?? props.min));

watch(
  () => props.modelValue,
  (nv) => {
    value.value = toNumber(nv);
  }
);

const maxNumber = computed(() => toNumber(props.max));

function emitValue() {
  emit("update:modelValue", value.value);
}

const formatValue = (raw) => {
  if (!props.format) {
    return `${props.valueFormat}${raw}`;
  }

  const numericValue = toNumber(raw);
  if (!Number.isFinite(numericValue)) {
    return `${props.valueFormat}${raw}`;
  }

  return secondToDayString(numericValue);
};

const displayCurrentValue = computed(() => formatValue(value.value));
const displayMaxValue = computed(() => formatValue(maxNumber.value));
</script>
