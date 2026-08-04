<script setup lang="ts">
import { PORTALS, portalsForUser, userTypeLabel, type PortalKey } from '~/config/portals'

const props = defineProps<{ portal: PortalKey }>()
defineEmits<{ menu: [] }>()

const route = useRoute()
const { user, logout } = useAuth()
const definition = computed(() => PORTALS[props.portal])
const currentItem = computed(() =>
  definition.value.nav.flatMap(group => group.items)
    .sort((a, b) => b.to.length - a.to.length)
    .find(item => route.path === item.to || route.path.startsWith(`${item.to}/`)),
)
const initials = computed(() => user.value?.name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?')
const roleLabel = computed(() => user.value ? userTypeLabel(user.value.type) : '')
const topNavigation = computed(() =>
  props.portal === 'cliente'
    ? definition.value.nav.flatMap(group => group.items)
      .filter(item => [
        '/painel/cliente',
        '/painel/cliente/agendar',
        '/painel/cliente/consultas',
        '/painel/cliente/prontuarios',
        '/painel/cliente/pets',
      ].includes(item.to))
    : [],
)
const accountItems = computed(() => [
  user.value && portalsForUser(user.value.type).length > 1
    ? portalsForUser(user.value.type).map(portal => ({
        label: portal.label,
        icon: portal.icon,
        to: portal.home,
      }))
    : [],
  [
    ...(props.portal === 'cliente'
      ? [{ label: 'Meu perfil', icon: 'i-heroicons-identification', to: '/painel/cliente/perfil' }]
      : []),
    { label: 'Voltar ao site', icon: 'i-heroicons-arrow-left-circle', to: '/' },
    { label: 'Sair', icon: 'i-heroicons-arrow-left-on-rectangle', onSelect: logout },
  ],
])
</script>

<template>
  <header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#071b30]/90 lg:px-6">
    <div class="flex min-w-0 items-center gap-3">
      <button class="flex size-11 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 lg:hidden" aria-label="Abrir navegação" @click="$emit('menu')">
        <UIcon name="i-heroicons-bars-3" class="size-6" />
      </button>
      <h1 class="truncate text-base font-semibold text-body-strong">{{ currentItem?.label ?? definition.label }}</h1>
    </div>
    <div class="ml-auto flex items-center gap-2">
      <nav v-if="topNavigation.length" aria-label="Atalhos do Portal do Cliente" class="hidden items-center gap-1 xl:flex">
        <NuxtLink
          v-for="item in topNavigation"
          :key="item.to"
          :to="item.to"
          class="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition"
          :class="route.path === item.to || (item.to !== '/painel/cliente' && route.path.startsWith(`${item.to}/`))
            ? 'bg-[var(--portal-accent)] text-white'
            : 'text-body-muted hover:bg-black/5 hover:text-body-strong dark:hover:bg-white/10'"
        >
          <UIcon :name="item.icon" class="size-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>
      <UDropdownMenu :items="accountItems" :content="{ align: 'end' }">
      <button class="flex min-h-11 items-center gap-2 rounded-full px-1.5 pr-3 hover:bg-black/5 dark:hover:bg-white/10">
        <span class="flex size-8 items-center justify-center rounded-full bg-[var(--portal-accent)] text-xs font-semibold text-white">{{ initials }}</span>
        <span class="hidden min-w-0 sm:block">
          <span class="block max-w-36 truncate text-sm font-medium leading-4 text-body-strong">{{ user?.name }}</span>
          <span class="block text-[11px] leading-4 text-body-muted">{{ roleLabel }} · {{ definition.loginLabel }}</span>
        </span>
        <UIcon name="i-heroicons-chevron-down" class="size-4 text-body-muted" />
      </button>
      </UDropdownMenu>
    </div>
  </header>
</template>
