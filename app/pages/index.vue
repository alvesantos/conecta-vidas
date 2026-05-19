<script setup lang="ts">
definePageMeta({
  noPadding: true
})
</script>

<template>
  <div class="relative">
    <header>
      <img 
        class="max-w-[50%] md:max-w-[20%] pt-6 px-6 md:pt-10 hidden md:block"
        src="/conectavet-extended-icon.png"
        alt="conectavet" />
    </header>

    <section class="flex flex-col">
      <!-- DOG BACKGROUND -->
      <div class="absolute right-0 top-0">
        <img
          class="conectavet-dog w-screen lg:w-[58vw]"
          src="/cute_dog.png"
          alt="doggo" />
      </div>

      <!-- SIDE CONTENT -->
      <div class="lg:p-6 px-2 max-w-[48%] lg:max-w-[35%] side-content">
        <!-- TITLE -->
        <p class="lg:text-[2.5rem] text-[1rem] text-center pt-4 lg:text-start">
          Seu pet merece o melhor cuidado,
          <span class="text-accent underline">onde você estiver</span>
        </p>

        <!-- DESCRIPTION -->
        <p class="px-2 py-4 lg:text-lg text-[.6rem]">
          Telemedicina veterinária com <span class="text-accent font-semibold">orientação, acolhimento e segurança</span> quando você mais precisar.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.side-content {
  & > :first-child {
    font-family: "Helvetica Neue", Arial, sans-serif;
    font-weight: 600;
  }
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