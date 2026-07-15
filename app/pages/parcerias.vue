<template>
  <div class="flex flex-col items-center px-4 py-6 lg:py-10 max-w-4xl mx-auto w-full">
    <h1 class="text-2xl lg:text-4xl font-semibold text-body-strong text-center mb-6">
      Parcerias
    </h1>

    <p class="text-body-muted text-center max-w-2xl mb-8 text-sm lg:text-base">
      Quer ser parceiro da ConectaVet? Clique na imagem abaixo ou no botão para falar com a nossa equipe pelo WhatsApp.
    </p>

    <button
      type="button"
      class="cursor-pointer group w-full max-w-xl rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover:scale-[1.01] transition-transform"
      @click="openWhatsApp"
    >
      <img
        src="/images/img-parcerias.png"
        alt="Seja parceiro da ConectaVet"
        class="w-full h-auto object-contain"
      />
    </button>

    <div class="mt-6">
      <UButton :to="WHATSAPP_URL" target="_blank" color="success" size="xl" icon="i-mdi-whatsapp" class="font-bold">
        Quero ser parceiro
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ noPadding: true });

const WHATSAPP_URL = "https://wa.me/5511978654921?text=" + encodeURIComponent("Quero ser parceiro");

function openWhatsApp() {
  window.open(WHATSAPP_URL, "_blank", "noopener");
}
</script>
