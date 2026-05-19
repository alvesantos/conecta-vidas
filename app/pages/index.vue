<script setup lang="ts">
definePageMeta({
  noPadding: true
})
</script>

<template>
  <div class="relative">
    <!-- DOG BACKGROUND -->
    <div class="absolute right-0 top-0">
      <img 
        class="conectavet-dog max-h-[30vh] md:max-h-[720px]"
        src="/cute_dog.png"
        alt="doggo" />
    </div>
    <header>
      <img 
        class="max-w-[50%] md:max-w-[20%] p-6 md:p-10"
        src="/conectavet-extended-icon.png"
        alt="conectavet" />
    </header>
  </div>
</template>

<style scoped>
.conectavet-dog {
  mask-image:
    linear-gradient(
      to left,
      white 0%,
      white 70%,
      transparent 100%
    );

  -webkit-mask-image:
    linear-gradient(
      to left,
      white 0%,
      white 70%,
      transparent 100%
    );

  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}
</style>