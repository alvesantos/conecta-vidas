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
  link: `py-3 hover:text-white hover:before:bg-white/10 ${collapsed.value ? "justify-center" : "px-2"}`,
  linkLeadingIcon: `shrink-0 group-hover:text-white ${collapsed.value ? "size-6" : "size-5"}`,
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
    class="relative min-h-screen bg-primary flex flex-col pt-2 pb-8 transition-all duration-300"
    :class="collapsed ? 'w-28' : 'w-64 px-4'"
  >
    <!-- Botão colapsar -->
    <button
      class="absolute -right-4 top-8 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary border border-accent text-white/70 hover:text-white hover:border-white/40 transition-all duration-200 shadow-md cursor-pointer"
      @click="collapsed = !collapsed"
    >
      <UIcon
        :name="collapsed ? 'i-heroicons-arrow-right-on-rectangle' : 'i-heroicons-arrow-left-on-rectangle'"
        class="size-4"
      />
    </button>

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
      <!-- Avatar com iniciais -->
      <div
        class="flex items-center justify-center rounded-full bg-accent text-white font-semibold shrink-0"
        :class="collapsed ? 'size-10 text-base' : 'size-9 text-sm'"
      >
        {{ userInitials }}
      </div>

      <!-- Nome (oculto quando collapsed) -->
      <div v-if="!collapsed" class="flex flex-col min-w-0">
        <span class="text-white font-medium text-sm truncate">{{ user?.name }}</span>
        <span class="text-white/50 text-xs truncate">{{ user?.email }}</span>
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
    <div v-if="isLoggedIn" class="mt-auto" :class="collapsed ? 'flex justify-center' : ''">
      <button
        class="flex items-center gap-3 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full cursor-pointer"
        :class="collapsed ? 'justify-center px-2' : 'px-2'"
        @click="logout"
      >
        <UIcon name="i-heroicons-arrow-left-on-rectangle" :class="collapsed ? 'size-6' : 'size-5'" class="shrink-0" />
        <span v-if="!collapsed" class="text-sm">Sair</span>
      </button>
    </div>
  </aside>
</template>
