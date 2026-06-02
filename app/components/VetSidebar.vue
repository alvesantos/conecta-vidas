<script setup lang="ts">
const { user, logout } = useAuth();

const collapsed = ref(false);

const items = [
  { label: 'Consultas', to: '/veterinario/consultas', icon: 'i-heroicons-calendar-days' },
  { label: 'Prescrições', to: '/veterinario/prescricoes', icon: 'i-heroicons-document-text' },
  { label: 'Carteira', to: '/veterinario/carteira', icon: 'i-heroicons-banknotes' },
  { label: 'Prontuários', to: '/veterinario/prontuarios', icon: 'i-heroicons-clipboard-document-list' },
  { label: 'Configurações', to: '/veterinario/configuracoes', icon: 'i-heroicons-cog-6-tooth' },
  { label: 'Voltar ao site', to: '/', icon: 'i-heroicons-arrow-left-circle' },
];

const ui = computed(() => ({
  link: `text-base hover:text-white hover:before:bg-white/10 ${collapsed.value ? 'justify-center py-4' : 'py-3'}`,
  linkLeadingIcon: `shrink-0 group-hover:text-white size-6`,
}));

const userInitials = computed(() => {
  if (!user.value?.name) return 'V';
  return user.value.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
});
</script>

<template>
  <aside
    class="sticky top-0 h-screen bg-primary flex flex-col pt-2 pb-6 transition-all duration-300 overflow-y-auto"
    :class="collapsed ? 'w-18' : 'w-64 px-4'"
  >
    <div class="flex flex-col items-center gap-1 mb-6 px-2">
      <img
        src="/conecta-icon.png"
        alt="ConectaVet"
        class="w-auto object-contain transition-all duration-300"
        :class="collapsed ? 'h-16 w-16' : 'h-28'"
      />
      <span v-if="!collapsed" class="text-white/80 text-xs font-semibold tracking-widest">
        VETERINÁRIO
      </span>
    </div>

    <div
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
        <span class="text-white/50 text-sm truncate">Veterinário(a)</span>
      </div>
    </div>

    <UNavigationMenu
      orientation="vertical"
      :items="items"
      :ui="ui"
      :collapsed="collapsed"
      class="w-full"
      :class="collapsed ? 'p-3' : ''"
    />

    <div class="mt-auto pt-4" :class="collapsed ? 'flex flex-col items-center gap-2' : ''">
      <button
        class="flex items-center gap-3 py-4 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full cursor-pointer"
        :class="collapsed ? 'justify-center px-2' : 'px-2'"
        @click="logout"
      >
        <UIcon
          name="i-heroicons-arrow-left-on-rectangle"
          :class="collapsed ? 'size-7' : 'size-6'"
          class="shrink-0"
        />
        <span v-if="!collapsed" class="text-base font-medium">Sair</span>
      </button>
    </div>

    <div
      class="pt-3 border-t border-white/10 mt-3"
      :class="collapsed ? 'flex justify-center' : ''"
    >
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
