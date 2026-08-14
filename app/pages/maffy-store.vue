<script setup lang="ts">
const config = useRuntimeConfig()
onMounted(() => navigateTo(config.public.maffyStoreUrl, { external: true }))
</script>

<template>
  <main class="flex min-h-screen items-center justify-center p-6">
    <div class="text-center">
      <UIcon name="i-heroicons-arrow-top-right-on-square" class="mx-auto size-10 text-primary" />
      <h1 class="mt-3 text-xl font-bold">Abrindo a Maffy Store</h1>
      <p class="mt-2 text-sm text-gray-500">A compra acontece integralmente na loja externa.</p>
      <UButton :to="config.public.maffyStoreUrl" external label="Ir para a loja" class="mt-5" />
    </div>
  </main>
</template>
