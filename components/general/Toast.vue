<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg min-w-[300px] max-w-md"
        :class="containerClass"
        role="alert"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <Icon
            :name="isSuccess ? 'mdi:check-circle' : 'mdi:close-circle'"
            class="text-2xl"
            :class="isSuccess ? 'text-green-100' : 'text-red-100'"
          />
        </div>

        <!-- Message -->
        <div class="flex-1">
          <p
            class="text-sm font-semibold"
            :class="isSuccess ? 'text-green-50' : 'text-red-50'"
          >
            {{ isSuccess ? "Berhasil" : "Gagal" }}
          </p>
          <p
            class="text-sm"
            :class="isSuccess ? 'text-green-100' : 'text-red-100'"
          >
            {{ message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          class="flex-shrink-0 rounded-md p-1 transition-colors"
          :class="
            isSuccess
              ? 'hover:bg-green-600 text-green-100'
              : 'hover:bg-red-600 text-red-100'
          "
          @click="close"
        >
          <Icon name="mdi:close" class="text-lg" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  type?: "success" | "error";
  message?: string;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "success",
  message: "",
  duration: 3000,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const visible = defineModel<boolean>("modelValue", { default: false });

const isSuccess = computed(() => props.type === "success");

const containerClass = computed(() =>
  isSuccess.value
    ? "bg-green-500 border border-green-400"
    : "bg-red-500 border border-red-400",
);

let timer: ReturnType<typeof setTimeout> | null = null;

function close() {
  visible.value = false;
  emit("close");
}

function startTimer() {
  if (timer) clearTimeout(timer);
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
}

watch(visible, (val) => {
  if (val) {
    startTimer();
  } else if (timer) {
    clearTimeout(timer);
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
