<script setup lang="ts">
const items = [
  { label: 'Cadastro', to: '/cadastro', icon: 'i-heroicons-user-plus' },
  { label: 'Login', to: '/login', icon: 'i-heroicons-arrow-right-on-rectangle' },
  { label: 'E-commerce', to: 'https://loja.conectavet.com.br', target: '_blank', icon: 'i-heroicons-shopping-bag' },
  { label: 'Assinaturas', to: '/assinaturas', icon: 'i-heroicons-credit-card' },
  { label: 'Suporte', to: '/suporte', icon: 'i-heroicons-lifebuoy' },
]

const ui = {
  link: 'py-3 px-2 text-base text-white/70 hover:text-white hover:before:bg-white/10',
  linkLeadingIcon: 'shrink-0 size-5 text-white/50 group-hover:text-white',
}
</script>

<template>
  <aside class="w-64 min-h-screen bg-[#0d1b4b] flex flex-col px-4 py-8 border-r border-[#1a2d6b]">
    <span class="text-white text-xl font-bold mb-8 px-2 tracking-wide">connectavet</span>
    <UNavigationMenu orientation="vertical" :items="items" :ui="ui" class="w-full" />
  </aside>
</template>
