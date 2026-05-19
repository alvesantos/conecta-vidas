<script setup>
const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-screen md:flex-row">
    <AppTopbar />
    <AppSidebar class="hidden md:flex" />
    <main class="flex-1" 
      :class="[
        route.meta.noPadding ? '' : 'p-6 md:p-10'
      ]">
      <slot />
    </main>
  </div>
</template>
