<template>
  <template v-if="route.path === '/discovery'">
    <div class="flex flex-col gap-2">
      <FileInfo />
    </div>
  </template>
  <template v-else-if="route.path === '/statistic'">
    <div class="flex flex-col gap-3 h-full min-h-0">
      <div
        class="w-full lg:w-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-4 lg:p-6 shadow-lg flex-shrink-0 overflow-auto scrollbar-hidden"
      >
        <div>
          <div class="mt-2 space-y-3">
            <slot name="stats">
              <statistic-sidebar-button
                name="Overview"
                placeholder="Overview"
                @click="setSelectedStatistic('Overview')"
                :is-active="selectedStatistic === 'Overview'"
              />
              <statistic-sidebar-button
                name="Cases"
                placeholder="Cases"
                @click="setSelectedStatistic('Cases')"
                :icon="'mdi:folder-account'"
                :is-active="selectedStatistic === 'Cases'"
              />
              <statistic-sidebar-button
                name="Resources"
                placeholder="Resources"
                @click="setSelectedStatistic('Resources')"
                :icon="'fa6-brands:black-tie'"
                :is-active="selectedStatistic === 'Resources'"
              />
              <statistic-sidebar-button
                name="Variants"
                placeholder="Variants"
                @click="setSelectedStatistic('Variants')"
                :icon="'uil:arrow-right'"
                :is-active="selectedStatistic === 'Variants'"
              />
            </slot>
          </div>
        </div>
      </div>
      <GeneralDiscoveryInfoPanel />
    </div>
  </template>
  <template v-else>
    <div class="flex flex-col gap-4">
      <div
        class="w-full lg:w-64 h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-4 lg:p-6 shadow-lg flex-shrink-1 overflow-auto scrollbar-hidden"
      >
        <div>
          <div class="mt-2 flex flex-col space-y-3">
            <NuxtLink to="/filter?t=variants%coverage">
              <statistic-sidebar-button
                name="Variants Coverage"
                placeholder="Variants Coverage"
                :is-active="selectedStatistic === 'Variants Coverage'"
              />
            </NuxtLink>
            <NuxtLink to="/filter?t=events%coverage">
              <statistic-sidebar-button
                name="Events Coverage"
                placeholder="Events Coverage"
                :is-active="selectedStatistic === 'Events Coverage'"
              />
            </NuxtLink>
            <NuxtLink to="/filter?t=case%duration">
              <statistic-sidebar-button
                name="Case duration"
                placeholder="Case duration"
                :is-active="selectedStatistic === 'Case duration'"
              />
            </NuxtLink>
            <NuxtLink to="/filter?t=number%of%events">
              <statistic-sidebar-button
                name="Case Number of events"
                placeholder="Case Number of events"
                :is-active="selectedStatistic === 'Number of events'"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
const route = useRoute();

const { selectedStatistic, setSelectedStatistic } = useStatistic();
</script>

<style scoped>
/* component-specific styles if needed */
</style>
