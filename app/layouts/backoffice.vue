<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <BackofficeHeader />

    <div class="flex flex-col flex-1 min-w-0">
      <main class="flex-1" :class="route.meta.noPadding ? '' : 'p-6 md:p-10'">
        <slot />
      </main>
    </div>
  </div>
</template>
