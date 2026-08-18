<script setup lang="ts">
import { PORTALS, type PortalKey } from '~/config/portals'

const props = defineProps<{ portal: PortalKey }>()
const route = useRoute()
const collapsedCookie = useCookie<'0' | '1'>('cv_painel_sidebar', { default: () => '0' })
const collapsed = computed({
  get: () => collapsedCookie.value === '1',
  set: value => { collapsedCookie.value = value ? '1' : '0' },
})
const mobileOpen = ref(false)
const portalAccent = computed(() => PORTALS[props.portal].accent)

watch(() => route.fullPath, () => { mobileOpen.value = false })
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-body" :style="{ '--portal-accent': portalAccent }">
    <div v-if="portal !== 'cliente'" class="fixed inset-y-0 left-0 z-40 hidden border-r border-gray-200 transition-[width] duration-200 lg:block" :class="collapsed ? 'w-16' : 'w-64'">
      <PainelSidebar :portal="portal" :collapsed="collapsed" @collapse="collapsed = !collapsed" />
    </div>

    <USlideover v-model:open="mobileOpen" side="left" :ui="{ content: 'w-72 max-w-[85vw] p-0' }">
      <template #content>
        <PainelSidebar :portal="portal" @navigate="mobileOpen = false" />
      </template>
    </USlideover>

    <div class="min-w-0 transition-[margin] duration-200" :class="portal === 'cliente' ? '' : (collapsed ? 'lg:ml-16' : 'lg:ml-64')">
      <PainelTopbar :portal="portal" @menu="mobileOpen = true" />
      <PainelPatientProfileSwitcher v-if="portal === 'cliente'" />
      <main class="min-h-[calc(100vh-4.5rem)]" :class="route.meta.noPadding ? '' : 'px-5 pb-28 pt-8 sm:px-6 md:px-8 md:pb-28 md:pt-10 lg:px-10 lg:pb-12 lg:pt-10'">
        <slot />
      </main>
    </div>
    <template v-if="portal === 'cliente'">
      <PainelPatientConectaModal />
      <PainelPatientBottomNav />
    </template>
  </div>
</template>
