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
      <div class="text-center mb-4">
        <h3 class="text-primary text-2xl lg:text-3xl font-semibold">
          Conheça nossas videoaulas
        </h3>
        <p class="text-primary/70 text-sm lg:text-base mt-1">
          Toque em qualquer imagem para falar com a gente no WhatsApp.
        </p>
      </div>

      <UCarousel
        v-slot="{ item }"
        loop
        dots
        :autoplay="{ delay: 3500 }"
        :items="slides"
        :ui="{
          item: 'basis-full lg:basis-1/2',
          dot: 'data-[state=active]:bg-accent size-3',
        }"
      >
        <button
          type="button"
          class="cursor-pointer w-full p-2"
          @click="openWhatsApp"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            class="w-full h-auto object-contain rounded-xl shadow-md hover:scale-[1.01] transition-transform"
          />
        </button>
      </UCarousel>
    </UCard>
  </section>
</template>
