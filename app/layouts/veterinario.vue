<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div class="flex min-h-screen md:flex-row flex-col bg-gray-50 dark:bg-[#011428]">
    <VetSidebar class="hidden md:flex shrink-0" />
    <VetTopbar class="md:hidden" />

    <div class="flex flex-col flex-1 min-w-0">
      <main class="flex-1" :class="route.meta.noPadding ? '' : 'p-6 md:p-10'">
        <slot />
      </main>
    </div>
  </div>
</template>
