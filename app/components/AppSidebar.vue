<script setup lang="ts">
const collapsed = ref(false)

const items = [
  { label: 'Cadastro', to: '/cadastro', icon: 'i-heroicons-user-plus' },
  { label: 'Login', to: '/login', icon: 'i-heroicons-arrow-right-on-rectangle' },
  { label: 'E-commerce', to: 'https://loja.conectavet.com.br', target: '_blank', icon: 'i-heroicons-shopping-bag' },
  { label: 'Assinaturas', to: '/assinaturas', icon: 'i-heroicons-credit-card' },
  { label: 'Suporte', to: '/suporte', icon: 'i-heroicons-lifebuoy' },
]

const ui = computed(() => ({
  link: `py-3 text-base text-white/70 hover:text-white hover:before:bg-white/10 ${collapsed.value ? 'justify-center' : 'px-2'}`,
  linkLeadingIcon: `shrink-0 text-white/50 group-hover:text-white ${collapsed.value ? 'size-7' : 'size-5'}`,
}))
</script>

<template>
  <aside
    class="relative min-h-screen bg-[#0d1b4b] flex flex-col pt-2 pb-8 border-r border-[#1a2d6b] transition-all duration-300"
    :class="collapsed ? 'w-28' : 'w-64 px-4'"
  >
    <button
      class="absolute -right-4 top-8 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#0d1b4b] border border-[#1a2d6b] text-white/70 hover:text-white hover:border-white/40 transition-all duration-200 shadow-md cursor-pointer"
      @click="collapsed = !collapsed"
    >
      <UIcon
        :name="collapsed ? 'i-heroicons-arrow-right-on-rectangle' : 'i-heroicons-arrow-left-on-rectangle'"
        class="size-4"
      />
    </button>

    <div class="flex items-center justify-center mb-6 px-2">
      <img
        v-if="!collapsed"
        src="/conecta-icon.png"
        alt="ConectaVet"
        class="h-40 w-auto object-contain"
      />
      <img
        v-else
        src="/conecta-icon.png"
        alt="ConectaVet"
        class="h-16 w-auto object-contain"
      />
    </div>

    <UNavigationMenu
      orientation="vertical"
      :items="items"
      :ui="ui"
      :collapsed="collapsed"
      class="w-full"
    />
  </aside>
</template>
