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
  linkLeadingIcon: 'shrink-0 size-5 text-white/50 group-hover:text-white',
}))
</script>

<template>
  <aside
    class="min-h-screen bg-[#0d1b4b] flex flex-col pt-2 pb-8 border-r border-[#1a2d6b] transition-all duration-300"
    :class="collapsed ? 'w-28' : 'w-64 px-4'"
  >
    <div class="flex items-center mb-8 px-2" :class="collapsed ? 'justify-center' : 'justify-between'">
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
      <UButton
        v-if="!collapsed"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-chevron-left"
        class="text-white/60 hover:text-white hover:bg-white/10"
        @click="collapsed = !collapsed"
      />
    </div>

    <UButton
      v-if="collapsed"
      color="neutral"
      variant="ghost"
      icon="i-heroicons-chevron-right"
      class="text-white/60 hover:text-white hover:bg-white/10 mb-4 mx-auto"
      @click="collapsed = !collapsed"
    />

    <UNavigationMenu
      orientation="vertical"
      :items="items"
      :ui="ui"
      :collapsed="collapsed"
      class="w-full"
    />
  </aside>
</template>
