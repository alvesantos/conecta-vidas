<script setup lang="ts">
const items = [
  { label: 'Cadastro', to: '/cadastro' },
  { label: 'Login', to: '/login' },
  { label: 'E-commerce', to: 'https://loja.conectavet.com.br', target: '_blank' },
  { label: 'Assinaturas', to: '/assinaturas' },
  { label: 'Suporte', to: '/suporte' },
]
</script>

<template>
  <aside class="w-64 min-h-screen bg-gray-900 flex flex-col px-4 py-8">
    <span class="text-white text-xl font-bold mb-8 px-2">connectavet</span>
    <UNavigationMenu orientation="vertical" :items="items" class="w-full" />
  </aside>
</template>
