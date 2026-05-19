<script setup lang="ts">

</script>

<template>
  <header>
    <img 
      class="max-w-[50%] md:max-w-[20%]"
      src="/conectavet-extended-icon.png"
      alt="conectavet" />
    <div class="absolute right-0 top-0">
      <img 
        class="conectavet-dog max-h-[28vh] md:max-h-[720px]"
        src="/cute_dog.png"
        alt="doggo" />
    </div>
  </header>
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