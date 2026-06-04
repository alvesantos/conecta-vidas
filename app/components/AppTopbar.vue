<script setup lang="ts">
interface NavItem {
  label: string;
  to: string;
  icon: string;
  target?: string;
  active?: boolean;
}

const menuOpen = ref(false);

const { user, isLoggedIn, isAdmin, logout } = useAuth();

const navItems: NavItem[] = [
  { label: "Início", to: "/", icon: "i-heroicons-home" },
  {
    label: "Solicitar consulta",
    to: "/solicitar-consulta",
    icon: "i-mdi-whatsapp",
  },
  {
    label: "Coletas a Domicílio",
    to: "https://wa.me/5511978654921?text=Oi%2C%20cliquei%20em%20Coleta%20a%20Domicilio",
    target: "_blank",
    icon: "i-mdi-truck-delivery",
  },
  {
    label: "Produtos",
    to: "https://maffy.com.br",
    target: "_blank",
    icon: "i-heroicons-shopping-bag",
  },
  {
    label: "Nossa história",
    to: "/nossa-historia",
    icon: "i-heroicons-book-open",
  },
  { label: "Assinaturas", to: "/assinaturas", icon: "i-heroicons-credit-card" },
];

const accountItems = computed<NavItem[]>(() => {
  if (!isLoggedIn.value) {
    return [
      { label: "Cadastro", to: "/cadastro", icon: "i-heroicons-user-plus" },
      {
        label: "Login",
        to: "/login",
        icon: "i-heroicons-arrow-right-on-rectangle",
      },
    ];
  }
  const items: NavItem[] = [
    { label: "Meus Animais", to: "/meu-pet", icon: "i-mdi-paw" },
  ];
  if (isAdmin.value) {
    items.push({
      label: "Backoffice",
      to: "/backoffice",
      icon: "i-heroicons-shield-check",
    });
  }
  return items;
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
    <img src="/conecta-icon.png" alt="ConectaVet" class="h-10 w-auto" />

    <div v-if="isLoggedIn" class="flex items-center gap-2">
      <div
        class="flex items-center justify-center size-8 rounded-full bg-accent text-white text-sm font-semibold"
      >
        {{ userInitials }}
      </div>
      <span class="text-white text-sm font-medium hidden xs:block">{{
        user?.name
      }}</span>
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
        :active-class="item.active === false ? '' : undefined"
        :exact-active-class="item.active === false ? '' : undefined"
        class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        @click="menuOpen = false"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>

      <!-- Divisor entre navegação e conta -->
      <div class="my-2 mx-5 border-t border-white/15" />

      <NuxtLink
        v-for="item in accountItems"
        :key="item.to"
        :to="item.to"
        :target="item.target"
        class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        @click="menuOpen = false"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>

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
