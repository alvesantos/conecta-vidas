<script setup lang="ts">
const menuOpen = ref(false)

const items = [
  { label: "Início", to: "/", icon: "i-heroicons-home" },
  { label: "Cadastro", to: "/cadastro", icon: "i-heroicons-user-plus" },
  { label: "Login", to: "/login", icon: "i-heroicons-arrow-right-on-rectangle" },
  {
    label: "E-commerce",
    to: "https://loja.conectavet.com.br",
    target: "_blank",
    icon: "i-heroicons-shopping-bag",
  },
  { label: "Assinaturas", to: "/assinaturas", icon: "i-heroicons-credit-card" },
  { label: "Suporte", to: "/suporte", icon: "i-heroicons-lifebuoy" },
]
</script>

<template>
  <header class="bg-[#0d1b4b] border-b border-[#1a2d6b] px-4 py-3 flex items-center justify-between md:hidden">
    <img src="/conecta-icon.png" alt="ConectaVet" class="h-10 w-auto" />

    <button
      class="text-white/70 hover:text-white transition-colors cursor-pointer"
      @click="menuOpen = !menuOpen"
    >
      <UIcon
        :name="menuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
        class="size-7"
      />
    </button>
  </header>

  <div
    v-show="menuOpen"
    class="bg-[#0d1b4b] border-b border-[#1a2d6b] md:hidden"
  >
    <nav class="flex flex-col py-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :target="item.target"
        class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        @click="menuOpen = false"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
