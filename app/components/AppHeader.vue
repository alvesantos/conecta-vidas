<script setup lang="ts">
interface NavItem {
  label: string;
  to: string;
  icon: string;
  target?: string;
}

const menuOpen = ref(false);
const route = useRoute();

import { portalForUser } from "~/config/portals";

const { user, isLoggedIn, logout } = useAuth();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
function toggleColorMode() {
  colorMode.preference = isDark.value ? "light" : "dark";
}

const navItems: NavItem[] = [
  { label: "Início", to: "/", icon: "i-heroicons-home" },
  {
    label: "Coletas a Domicílio",
    to: "https://wa.me/5511978654921?text=Oi%2C%20cliquei%20em%20Coleta%20a%20Domicilio",
    target: "_blank",
    icon: "i-mdi-truck-delivery",
  },
  {
    label: "Parcerias",
    to: "/parcerias",
    icon: "i-mdi-handshake",
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
      {
        label: "Acesso",
        to: "/login",
        icon: "i-heroicons-arrow-right-on-rectangle",
      },
    ];
  }
  if (!user.value) return [];
  const portal = portalForUser(user.value.type);
  return [
    { label: portal.label, to: portal.home, icon: portal.icon },
    ...(user.value.type === "tutor"
      ? [{ label: "Meus Animais", to: "/painel/cliente/pets", icon: "i-mdi-paw" }]
      : []),
  ];
});

// Itens do menu suspenso (avatar) no desktop
const userMenuItems = computed(() => [
  accountItems.value.map((item) => ({
    label: item.label,
    icon: item.icon,
    to: item.to,
  })),
  [
    {
      label: isDark.value ? "Modo claro" : "Modo escuro",
      icon: isDark.value ? "i-heroicons-sun" : "i-heroicons-moon",
      onSelect: () => toggleColorMode(),
    },
    {
      label: "Sair",
      icon: "i-heroicons-arrow-left-on-rectangle",
      onSelect: () => logout(),
    },
  ],
]);

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

// Fecha o menu mobile ao navegar
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  }
);
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white/90 dark:bg-primary/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-6">
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0 flex items-center">
          <img
            src="/icons/logo-claro.png"
            alt="ConectaVidas"
            class="h-20 w-auto dark:hidden"
          />
          <img
            src="/icons/logo-escuro.png"
            alt="ConectaVidas"
            class="h-20 w-auto hidden dark:block"
          />
        </NuxtLink>

        <!-- Navegação principal (desktop) -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-3 flex-1 justify-center">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :target="item.target"
            class="px-3.5 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap text-primary/70 hover:text-primary hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 aria-[current=page]:text-primary aria-[current=page]:bg-primary/8 dark:aria-[current=page]:text-white dark:aria-[current=page]:bg-white/10"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Ações à direita (desktop) -->
        <div class="hidden md:flex items-center gap-2 shrink-0">
          <template v-if="isLoggedIn">
            <UDropdownMenu
              :items="userMenuItems"
              :content="{ align: 'end' }"
            >
              <button
                class="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-primary/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span
                  class="flex items-center justify-center size-8 rounded-full bg-accent text-white text-sm font-semibold"
                >
                  {{ userInitials }}
                </span>
                <span
                  class="text-primary dark:text-white text-sm font-medium max-w-32 truncate"
                  >{{ user?.name }}</span
                >
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="size-4 text-primary/50 dark:text-white/60"
                />
              </button>
            </UDropdownMenu>
          </template>

          <template v-else>
            <UButton
              to="/login"
              color="primary"
              variant="ghost"
              size="sm"
              class="!text-primary/80 hover:!bg-primary/5 dark:!text-white dark:hover:!bg-white/10"
            >
              Acesso
            </UButton>
          </template>

          <!-- Alternar tema (canto mais à direita) -->
          <button
            class="ml-1 text-primary/60 hover:text-primary hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer p-2 rounded-full"
            :title="isDark ? 'Modo claro' : 'Modo escuro'"
            @click="toggleColorMode"
          >
            <UIcon
              :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              class="size-5"
            />
          </button>
        </div>

        <!-- Botão hambúrguer (mobile) -->
        <button
          class="md:hidden text-primary/70 hover:text-primary dark:text-white/80 dark:hover:text-white transition-colors cursor-pointer p-1"
          :aria-expanded="menuOpen"
          aria-label="Abrir menu"
          @click="menuOpen = !menuOpen"
        >
          <UIcon
            :name="menuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            class="size-7"
          />
        </button>
      </div>
    </div>

    <!-- Painel mobile -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-show="menuOpen"
        class="md:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-primary/95 backdrop-blur-xl"
      >
        <div
          v-if="isLoggedIn"
          class="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-white/10"
        >
          <div
            class="flex items-center justify-center size-10 rounded-full bg-accent text-white font-semibold"
          >
            {{ userInitials }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-primary dark:text-white font-medium text-sm">{{
              user?.name
            }}</span>
            <span class="text-primary/50 dark:text-white/50 text-xs truncate">{{
              user?.email
            }}</span>
          </div>
        </div>

        <nav class="flex flex-col py-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :target="item.target"
            class="flex items-center gap-3 px-5 py-3 transition-colors text-primary/70 hover:text-primary hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 aria-[current=page]:text-primary aria-[current=page]:bg-primary/5 dark:aria-[current=page]:text-white dark:aria-[current=page]:bg-white/5"
            @click="menuOpen = false"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <div class="my-2 mx-5 border-t border-gray-200 dark:border-white/15" />

          <NuxtLink
            v-for="item in accountItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-5 py-3 transition-colors text-primary/70 hover:text-primary hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
            @click="menuOpen = false"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <button
            class="flex items-center gap-3 px-5 py-3 transition-colors w-full cursor-pointer text-primary/70 hover:text-primary hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
            @click="toggleColorMode"
          >
            <UIcon
              :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              class="size-5 shrink-0"
            />
            <span>{{ isDark ? "Modo claro" : "Modo escuro" }}</span>
          </button>

          <button
            v-if="isLoggedIn"
            class="flex items-center gap-3 px-5 py-3 transition-colors w-full cursor-pointer text-primary/70 hover:text-primary hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 border-t border-gray-200 dark:border-white/10 mt-1"
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
    </Transition>
  </header>
</template>
