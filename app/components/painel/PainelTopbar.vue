<script setup lang="ts">
import { PORTALS, portalsForUser, type PortalKey } from '~/config/portals'

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
const topNavigation = computed(() =>
  props.portal === 'cliente'
    ? [
        { label: 'Solicitar consulta', to: '/painel/cliente/agendar', icon: 'i-heroicons-plus-circle' },
        { label: 'Pet', to: '/painel/cliente/pets', icon: 'i-mdi-paw' },
        { label: 'Agendamentos', to: '/painel/cliente/consultas', icon: 'i-heroicons-calendar-days' },
      ]
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
      ? [
          { label: 'Meu perfil', icon: 'i-heroicons-identification', to: '/painel/cliente/perfil' },
          { label: 'Histórico', icon: 'i-heroicons-clock', to: '/painel/cliente/prontuarios' },
        ]
      : []),
    { label: 'Voltar ao site', icon: 'i-heroicons-arrow-left-circle', to: '/' },
    { label: 'Sair', icon: 'i-heroicons-arrow-left-on-rectangle', onSelect: logout },
  ],
])
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
    <div class="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
    <div class="flex min-w-0 items-center gap-3">
      <button class="flex size-11 items-center justify-center rounded-lg hover:bg-black/5 lg:hidden" aria-label="Abrir navegação" @click="$emit('menu')">
        <UIcon name="i-heroicons-bars-3" class="size-6" />
      </button>
      <NuxtLink v-if="portal === 'cliente'" to="/painel/cliente" class="flex shrink-0 items-center" aria-label="Portal do Cliente">
        <img src="/icons/logo-claro.png" alt="ConectaVidas" class="h-16 w-auto lg:h-18" />
      </NuxtLink>
      <h1 v-else class="truncate text-base font-semibold text-body-strong">{{ currentItem?.label ?? definition.label }}</h1>
    </div>
      <nav v-if="topNavigation.length" aria-label="Menu do Portal do Cliente" class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
        <NuxtLink
          v-for="item in topNavigation"
          :key="item.to"
          :to="item.to"
          class="flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition lg:px-4"
          :class="route.path === item.to || (item.to !== '/painel/cliente' && route.path.startsWith(`${item.to}/`))
            ? 'bg-[var(--portal-accent)] text-white'
            : 'text-body-muted hover:bg-black/5 hover:text-body-strong'"
        >
          <UIcon :name="item.icon" class="size-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>
    <div class="ml-auto flex items-center gap-2">
      <UDropdownMenu :items="accountItems" :content="{ align: 'end' }">
      <button class="flex min-h-11 items-center gap-2 rounded-full px-1.5 pr-3 hover:bg-black/5">
        <span class="flex size-8 items-center justify-center rounded-full bg-[var(--portal-accent)] text-xs font-semibold text-white">{{ initials }}</span>
        <span class="hidden min-w-0 sm:block">
          <span class="block max-w-36 truncate text-sm font-medium text-body-strong">{{ user?.name }}</span>
        </span>
        <UIcon name="i-heroicons-chevron-down" class="size-4 text-body-muted" />
      </button>
      </UDropdownMenu>
    </div>
    </div>
  </header>
</template>
