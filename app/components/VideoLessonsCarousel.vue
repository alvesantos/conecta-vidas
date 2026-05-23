<script setup lang="ts">
const slides = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/slide/img-${n}-carrossel.png`,
    alt: `Videoaula ConectaVet ${i + 1}`,
  };
});

const WHATSAPP_URL =
  "https://wa.me/5511978654921?text=" +
  encodeURIComponent(
    "Oi, gostaria de me informar mais sobre as videoaulas do ConectaVet."
  );

function openWhatsApp() {
  window.open(WHATSAPP_URL, "_blank", "noopener");
}
</script>

<template>
  <section id="videoaulas" class="scroll-mt-6">
    <UCard :ui="{ body: 'bg-foreground' }">
      <div class="text-center mb-4 px-2">
        <h3 class="text-primary text-xl sm:text-2xl lg:text-3xl font-semibold">
          Conheça nossas videoaulas
        </h3>
        <p class="text-primary/70 text-xs sm:text-sm lg:text-base mt-1">
          Toque em qualquer imagem para falar com a gente no WhatsApp.
        </p>
      </div>

      <div class="mx-auto w-full max-w-6xl">
        <UCarousel
          v-slot="{ item }"
          loop
          :autoplay="{ delay: 3500 }"
          :items="slides"
          :ui="{
            item: 'basis-4/5 lg:basis-1/2',
          }"
        >
          <div class="px-1.5 sm:px-2">
            <button
              type="button"
              class="cursor-pointer block w-full mx-auto aspect-3/2 overflow-hidden rounded-lg shadow-md ring-1 ring-black/5 hover:scale-[1.01] transition-transform"
              @click="openWhatsApp"
            >
              <img
                :src="item.src"
                :alt="item.alt"
                loading="lazy"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </UCarousel>
      </div>
    </UCard>
  </section>
</template>
