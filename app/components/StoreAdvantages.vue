<script lang="ts" setup>
const advantageColumns = [1, 2, 3, 4]
</script>

<template>
  <section>
    <UCard :ui="{ body: 'bg-foreground' }">

      <!-- MOBILE -->
      <UCarousel
        class="lg:hidden"
        v-slot="{ item }"
        loop
        dots
        :autoplay="{ delay: 2000 }"
        :items="advantageColumns"
        :ui="{ 
          item: 'basis-full',
          dot: 'data-[state=active]:bg-accent size-3'
        }"
      >
        <div class="bg-foreground p-4 text-center">
          {{ item }}
        </div>
      </UCarousel>

      <div class="text-transparent lg:hidden">a</div>

      <!-- DESKTOP ==================== -->
      <div class="hidden lg:grid grid-cols-4 gap-px bg-gray-300">
        <div
          v-for="item in advantageColumns"
          :key="item"
          class="bg-foreground p-4 text-center"
        >
          {{ item }}
        </div>
      </div>
    </UCard>
  </section>
</template>
<style scoped>
</style>