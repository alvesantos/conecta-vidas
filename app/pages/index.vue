<script setup lang="ts">
definePageMeta({
  noPadding: true
})
</script>

<template>
  <div class="relative">
    <header>
      <img 
        class="max-w-[50%] md:max-w-[20%] p-6 md:p-10 hidden md:block"
        src="/conectavet-extended-icon.png"
        alt="conectavet" />
    </header>

    <section class="flex flex-col">
      <!-- DOG BACKGROUND -->
      <div class="absolute right-0 top-0">
        <img 
          class="conectavet-dog min-w-[100vw] lg:min-w-auto lg:max-w-[58vw]"
          src="/cute_dog.png"
          alt="doggo" />
      </div>

      <!-- SIDE CONTENT -->
      <p class="lg:p-6 p-2 max-w-[48%] lg:max-w-[35%] side-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </section>
  </div>
</template>

<style scoped>
.side-content {
  text-overflow: ellipsis;
}

/* Desktop */
@media (min-width: 1024px) {
  .conectavet-dog {
    mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 76%,
        transparent 96%
      );

    -webkit-mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 76%,
        transparent 96%
      );

    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
}

/* Mobile */
@media (max-width: 1023px) {
  .conectavet-dog {
    mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 47%,
        transparent 60%
      );

    -webkit-mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 47%,
        transparent 55%
      );
  }
}
</style>