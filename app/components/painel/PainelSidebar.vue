<script setup lang="ts">
import { PORTALS, portalsForUser, type PortalKey } from '~/config/portals'

const props = defineProps<{
  portal: PortalKey
  collapsed?: boolean
  pendingApprovals?: number
}>()

defineEmits<{ collapse: []; navigate: [] }>()
const definition = computed(() => PORTALS[props.portal])
const { user, logout } = useAuth()
const availablePortals = computed(() => user.value ? portalsForUser(user.value.type) : [])
const { activeProfile } = usePatientProfile()
const navigationGroups = computed(() => definition.value.nav.map(group => ({
  ...group,
  items: group.items
    .filter(item => !(props.portal === 'cliente' && activeProfile.value.kind === 'veterinaria' && item.to === '/painel/cliente/dependentes'))
    .map(item => {
      if (props.portal !== 'cliente') return item
      const veterinary = activeProfile.value.kind === 'veterinaria'
      const contextualLabels: Record<string, string> = {
        '/painel/cliente/consultas': veterinary ? 'Consultas veterinárias' : 'Consultas humanas',
        '/painel/cliente/prontuarios': veterinary ? 'Prontuário do pet' : 'Prontuário humano',
        '/painel/cliente/receitas': veterinary ? 'Receitas veterinárias' : 'Receitas médicas',
        '/painel/cliente/exames': veterinary ? 'Exames veterinários' : 'Exames humanos',
        '/painel/cliente/marketplace': veterinary ? 'Maffy Store' : 'Benefícios',
      }
      return { ...item, label: contextualLabels[item.to] ?? item.label }
    }),
})))
const portalItems = computed(() => [availablePortals.value.map(portal => ({
  label: portal.label,
  icon: portal.icon,
  to: portal.home,
}))])
</script>

<template>
  <aside class="flex h-full flex-col bg-white dark:bg-[#071b30]">
    <NuxtLink
      :to="definition.home"
      class="flex h-18 items-center gap-3 border-b border-gray-200 px-4 dark:border-white/10"
      :class="{ 'justify-center px-2': collapsed }"
    >
      <img src="/conecta-icon.png" alt="ConectaVidas" class="size-10 shrink-0 object-contain" />
      <span v-if="!collapsed" class="min-w-0 text-sm font-semibold text-body-strong">
        {{ definition.label }}
      </span>
    </NuxtLink>

    <nav aria-label="Navegação do portal" class="flex-1 space-y-5 overflow-y-auto p-3">
      <section v-for="(group, index) in navigationGroups" :key="`${group.label}-${index}`">
        <p v-if="group.label && !collapsed" class="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-body-muted">
          {{ group.label }}
        </p>
        <div class="space-y-1">
          <PainelPainelNavItem
            v-for="item in group.items"
            :key="item.to"
            :item="item"
            :collapsed="collapsed"
            :badge-count="item.badge === 'aprovacoes-pendentes' ? pendingApprovals : undefined"
            @click="$emit('navigate')"
          />
        </div>
      </section>
    </nav>

    <div class="space-y-1 border-t border-gray-200 p-3 dark:border-white/10">
      <UDropdownMenu v-if="availablePortals.length > 1" :items="portalItems" :content="{ side: 'right', align: 'end' }">
        <button class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-body-muted hover:bg-black/5 dark:hover:bg-white/10" :class="{ 'justify-center': collapsed }" :aria-label="collapsed ? 'Trocar de portal' : undefined">
          <UIcon name="i-heroicons-arrows-right-left" class="size-5 shrink-0" />
          <span v-if="!collapsed">Trocar de portal</span>
        </button>
      </UDropdownMenu>
      <NuxtLink to="/" class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-body-muted hover:bg-black/5 dark:hover:bg-white/10" :class="{ 'justify-center': collapsed }">
        <UIcon name="i-heroicons-arrow-left-circle" class="size-5 shrink-0" />
        <span v-if="!collapsed">Voltar ao site</span>
      </NuxtLink>
      <button class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10" :class="{ 'justify-center': collapsed }" :aria-label="collapsed ? 'Sair' : undefined" @click="logout">
        <UIcon name="i-heroicons-arrow-left-on-rectangle" class="size-5 shrink-0" />
        <span v-if="!collapsed">Sair</span>
      </button>
      <button
        class="hidden min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-body-muted hover:bg-black/5 dark:hover:bg-white/10 lg:flex"
        :class="{ 'justify-center': collapsed }"
        :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
        @click="$emit('collapse')"
      >
        <UIcon :name="collapsed ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'" class="size-5" />
        <span v-if="!collapsed">Recolher menu</span>
      </button>
    </div>
  </aside>
</template>
