<script setup lang="ts">
interface NavItem {
  label: string;
  to: string;
  icon: string;
  target?: string;
}

const menuOpen = ref(false);

const { user, isLoggedIn, logout } = useAuth();

const commonAdminItems: NavItem[] = [
  { label: 'Dashboard', to: '/backoffice', icon: 'i-heroicons-squares-2x2' },
  { label: 'Usuários', to: '/backoffice/usuarios', icon: 'i-heroicons-users' },
  { label: 'Pets', to: '/backoffice/pets', icon: 'i-mdi-paw' },
  { label: 'Planos', to: '/backoffice/planos', icon: 'i-heroicons-credit-card' },
  { label: 'Voltar ao site', to: '/', icon: 'i-heroicons-arrow-left-circle' },
];

const navItems = computed<NavItem[]>(() => {
  return commonAdminItems;
});

const userInitials = computed(() => {
  if (!user.value?.name) return "?";
  return user.value.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

function handleLogout() {
  menuOpen.value = false;
  logout();
}
</script>

<template>
  <header
    class="bg-[#0d1b4b] border-b border-[#1a2d6b] px-4 py-3 flex items-center justify-between md:hidden"
  >
    <div class="flex items-center ">
      <img src="/conecta-icon.png" alt="ConectaVet" class="h-10 w-auto" />
      <span class="text-white/80 text-xs font-semibold tracking-widest">
        BACKOFFICE
      </span>
    </div>

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
    <!-- Card do usuário logado no topo do dropdown -->
    <div
      v-if="isLoggedIn"
      class="flex items-center gap-3 px-5 py-4 border-b border-white/10"
    >
      <div
        class="flex items-center justify-center size-10 rounded-full bg-accent text-white font-semibold"
      >
        {{ userInitials }}
      </div>
      <div class="flex flex-col min-w-0">
        <span class="text-white font-medium text-sm">{{ user?.name }}</span>
        <span class="text-white/50 text-xs truncate">{{ user?.email }}</span>
      </div>
    </div>

    <nav class="flex flex-col py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :target="item.target"
        class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        @click="menuOpen = false"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>

      <!-- Botão Sair (somente logado) -->
      <button
        v-if="isLoggedIn"
        class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full cursor-pointer mt-1 border-t border-white/10"
        @click="handleLogout"
      >
        <UIcon
          name="i-heroicons-arrow-left-on-rectangle"
          class="size-5 shrink-0"
        />
        <span>Sair</span>
      </button>
    </nav>
  </div>
</template>
