<script setup lang="ts">
interface NavItem {
  label: string;
  to: string;
  icon: string;
  target?: string;
}

const menuOpen = ref(false);
const route = useRoute();

const { user, isLoggedIn, isAdmin, isVet, logout } = useAuth();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
function toggleColorMode() {
  colorMode.preference = isDark.value ? "light" : "dark";
}

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
  if (isVet.value) {
    items.push({
      label: "Painel Veterinário",
      to: "/veterinario/consultas",
      icon: "i-mdi-stethoscope",
    });
  }
  return items;
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
    class="sticky top-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/10"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0 flex items-center">
          <img src="/conecta-icon.png" alt="ConectaVet" class="h-11 w-auto" />
        </NuxtLink>

        <!-- Navegação principal (desktop) -->
        <nav class="hidden md:flex items-center gap-1 flex-1 justify-center">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :target="item.target"
            class="px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors whitespace-nowrap aria-[current=page]:text-white aria-[current=page]:bg-white/10"
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
                class="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span
                  class="flex items-center justify-center size-8 rounded-full bg-accent text-white text-sm font-semibold"
                >
                  {{ userInitials }}
                </span>
                <span class="text-white text-sm font-medium max-w-32 truncate">{{
                  user?.name
                }}</span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="size-4 text-white/60"
                />
              </button>
            </UDropdownMenu>
          </template>

          <template v-else>
            <button
              class="text-white/70 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/10"
              :title="isDark ? 'Modo claro' : 'Modo escuro'"
              @click="toggleColorMode"
            >
              <UIcon
                :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                class="size-5"
              />
            </button>
            <UButton
              to="/login"
              color="primary"
              variant="ghost"
              size="sm"
              class="!text-white hover:bg-white/10 dark:hover:bg-white/10"
            >
              Login
            </UButton>
            <UButton
              to="/cadastro"
              color="primary"
              size="sm"
              class="!bg-accent !text-white hover:!bg-accent/90 dark:!bg-accent dark:!text-white dark:hover:!bg-accent/85"
            >
              Cadastro
            </UButton>
          </template>
        </div>

        <!-- Botão hambúrguer (mobile) -->
        <button
          class="md:hidden text-white/80 hover:text-white transition-colors cursor-pointer p-1"
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
        class="md:hidden border-t border-white/10 bg-primary/95 backdrop-blur-xl"
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
            class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors aria-[current=page]:text-white aria-[current=page]:bg-white/5"
            @click="menuOpen = false"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <div class="my-2 mx-5 border-t border-white/15" />

          <NuxtLink
            v-for="item in accountItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            @click="menuOpen = false"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <button
            class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full cursor-pointer"
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
            class="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full cursor-pointer border-t border-white/10 mt-1"
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
