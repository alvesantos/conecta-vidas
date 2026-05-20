<script setup lang="ts">
const collapsed = ref(false)

const { user, isLoggedIn, logout } = useAuth()

// Itens visíveis sempre (logado ou não)
const commonItems = [
  { label: "Início", to: "/", icon: "i-heroicons-home" },
  {
    label: "E-commerce",
    to: "https://loja.conectavet.com.br",
    target: "_blank",
    icon: "i-heroicons-shopping-bag",
  },
  { label: "Assinaturas", to: "/assinaturas", icon: "i-heroicons-credit-card" },
]

// Itens somente para usuários NÃO logados
const guestItems = [
  { label: "Cadastro", to: "/cadastro", icon: "i-heroicons-user-plus" },
  { label: "Login", to: "/login", icon: "i-heroicons-arrow-right-on-rectangle" },
]

const navItems = computed(() =>
  isLoggedIn.value ? commonItems : [...commonItems, ...guestItems]
)

const ui = computed(() => ({
  link: `py-4 text-base hover:text-white hover:before:bg-white/10 ${collapsed.value ? "justify-center" : "px-2"}`,
  linkLeadingIcon: `shrink-0 group-hover:text-white ${collapsed.value ? "size-7" : "size-6"}`,
}))

// Iniciais do nome do usuário para o avatar
const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})
</script>

<template>
  <aside
    class="sticky top-0 h-screen bg-primary flex flex-col pt-2 pb-6 transition-all duration-300 overflow-y-auto"
    :class="collapsed ? 'w-28' : 'w-64 px-4'"
  >

    <!-- Logo -->
    <div class="flex items-center justify-center mb-6 px-2">
      <img
        src="/conecta-icon.png"
        alt="ConectaVet"
        class="w-auto object-contain transition-all duration-300"
        :class="collapsed ? 'h-20 w-20' : 'h-40'"
      />
    </div>

    <!-- Info do usuário logado -->
    <div
      v-if="isLoggedIn"
      class="flex items-center gap-3 mb-4 px-2 py-3 rounded-xl bg-white/10"
      :class="collapsed ? 'justify-center' : ''"
    >
      <div
        class="flex items-center justify-center rounded-full bg-accent text-white font-semibold shrink-0"
        :class="collapsed ? 'size-11 text-lg' : 'size-10 text-base'"
      >
        {{ userInitials }}
      </div>

      <div v-if="!collapsed" class="flex flex-col min-w-0">
        <span class="text-white font-medium text-base truncate">{{ user?.name }}</span>
        <span class="text-white/50 text-sm truncate">{{ user?.email }}</span>
      </div>
    </div>

    <!-- Menu de navegação -->
    <UNavigationMenu
      orientation="vertical"
      :items="navItems"
      :ui="ui"
      :collapsed="collapsed"
      class="w-full"
    />

    <!-- Botão Sair (somente logado) -->
    <div v-if="isLoggedIn" class="mt-auto pt-4" :class="collapsed ? 'flex flex-col items-center gap-2' : ''">
      <button
        class="flex items-center gap-3 py-4 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full cursor-pointer"
        :class="collapsed ? 'justify-center px-2' : 'px-2'"
        @click="logout"
      >
        <UIcon name="i-heroicons-arrow-left-on-rectangle" :class="collapsed ? 'size-7' : 'size-6'" class="shrink-0" />
        <span v-if="!collapsed" class="text-base font-medium">Sair</span>
      </button>
    </div>

    <!-- Botão colapsar (rodapé) -->
    <div class="pt-3 border-t border-white/10 mt-3" :class="collapsed ? 'flex justify-center' : ''">
      <button
        class="flex items-center gap-3 py-3 text-white/40 hover:text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full cursor-pointer"
        :class="collapsed ? 'justify-center px-2' : 'px-2'"
        @click="collapsed = !collapsed"
      >
        <UIcon
          :name="collapsed ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'"
          class="size-5 shrink-0"
        />
        <span v-if="!collapsed" class="text-sm">Recolher menu</span>
      </button>
    </div>
  </aside>
</template>
