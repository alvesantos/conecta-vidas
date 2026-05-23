<script setup lang="ts">
definePageMeta({
  noPadding: true,
});

const WHATSAPP_URL =
  "https://wa.me/5511978654921?text=" +
  encodeURIComponent(
    "Oi, gostaria de solicitar uma consulta com a ConectaVet."
  );

function openWhatsApp() {
  window.open(WHATSAPP_URL, "_blank", "noopener");
}
</script>

<template>
  <div class="flex flex-col items-center px-4 py-6 lg:py-10">
    <h1 class="text-2xl lg:text-4xl font-semibold text-primary text-center mb-6">
      Solicitar consulta
    </h1>

    <p class="text-primary/70 text-center max-w-2xl mb-6 text-sm lg:text-base">
      Clique na imagem abaixo para falar com a nossa equipe pelo WhatsApp.
    </p>

    <button
      type="button"
      class="cursor-pointer group w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover:scale-[1.01] transition-transform"
      @click="openWhatsApp"
    >
      <img
        src="/images/img-consulta.png"
        alt="Solicitar consulta ConectaVet"
        class="w-full h-auto object-contain"
      />
    </button>

    <a
      :href="WHATSAPP_URL"
      target="_blank"
      rel="noopener"
      class="mt-6 inline-flex items-center gap-2 bg-[#18c256] hover:bg-[#139645] text-white font-medium rounded-lg px-5 py-3 transition-colors"
    >
      <UIcon name="i-mdi-whatsapp" class="size-5" />
      Falar no WhatsApp
    </a>
  </div>
</template>
