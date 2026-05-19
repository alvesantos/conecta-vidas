<script setup lang="ts">
import subscriptionAd from '~/layouts/subscriptionAd.vue';

definePageMeta({
  noPadding: true
})
</script>

<template>
  <div>
    <div class="relative">
      <header>
        <img 
          class="max-w-[50%] md:max-w-[20%] pt-6 px-6 md:pt-10 hidden md:block absolute"
          src="/conectavet-extended-icon.png"
          alt="conectavet" />
      </header>

      <div>
        <section class="flex w-full justify-between">
        <!-- SIDE CONTENT -->
          <div class="lg:max-w-[30%] max-w-[50%] max-h-full lg:pt-[150px] lg:px-4 flex flex-col justify-between">
            <div class="side-content pt-2 pl-2">
              <!-- TITLE -->
              <p class="text-lg lg:text-5xl">
                Seu pet merece o melhor cuidado,
                <span class="text-accent underline">onde você estiver</span>
              </p>

              <!-- DESCRIPTION -->
              <p class="lg:text-lg text-[.6rem] lg:pt-8 pt-6">
                Telemedicina veterinária com <span class="text-accent font-semibold">orientação, acolhimento e segurança</span> quando você mais precisar.
              </p>
            </div>
          </div>
          
          <!-- DOG BACKGROUND -->
          <div class="lg:max-w-[70%] max-w-[50%] shrink-0 overflow-hidden">
            <img
              class="conectavet-dog w-full h-full object-cover object-[65%_center] scale-130 lg:scale-100"
              src="/cute_dog.png"
              alt="doggo" />
          </div>
        </section>
      </div>

      <section class="w-full lg:absolute lg:bottom-0 static">
        <subscriptionAd />
      </section>
    </div>

    <div>
      <!-- BENEFITS AND WHATSAPP BANNER -->
      <section class=" pt-4 px-4 lg:px-6">
        <UCard 
          :ui="{body: 'bg-foreground'}"
          >
          <div class="grid grid-cols-4 gap-2 bg-primary-400">
            <div class="bg-black p-4 text-center">1</div>
            <div class="bg-black p-4 text-center">2</div>
            <div class="bg-black p-4 text-center">3</div>
            <div class="bg-black p-4 text-center">4</div>
          </div>
        </UCard>
      </section>
    </div>
  </div>
</template>

<style scoped>
.side-content {
  & > :first-child {
    font-family:
      "Recoleta", "DM Serif Display", Georgia, serif;
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
        white 60%,
        transparent 85%
      );

    -webkit-mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 60%,
        transparent 85%
      );
  }
}
</style>