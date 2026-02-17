<template>
  <NuxtLayout>
    <NuxtPage keepalive />
  </NuxtLayout>

  <GeneralToast
    v-model="toastState.show"
    :type="toastState.type"
    :message="toastState.message"
  />
</template>

<script setup lang="ts">
import { useToast } from "./composables/useToast";

const { toastState } = useToast();
</script>
