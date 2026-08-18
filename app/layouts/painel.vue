<script setup lang="ts">
import { isPortalKey, type PortalKey } from '~/config/portals'

const route = useRoute()
const portal = computed<PortalKey>(() =>
  isPortalKey(route.meta.portal) ? route.meta.portal : 'cliente',
)
</script>

<template>
  <PainelShell :portal="portal">
    <slot />
  </PainelShell>
  <ConsultationSession v-if="portal === 'medico' || portal === 'veterinario'" />
</template>
