<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })
const { activeProfile, loadProfiles } = usePatientProfile()
onMounted(() => loadProfiles())
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Exames</h1><p class="text-sm text-body-muted">Solicitações e resultados de {{ activeProfile.label }}.</p></div>
    <UCard>
      <div class="flex flex-col items-center py-12 text-center">
        <UIcon name="i-heroicons-beaker" class="size-12 text-body-muted" />
        <p class="mt-4 font-medium text-body-strong">Nenhum exame para este perfil</p>
        <p class="mt-1 text-sm text-body-muted">Quando houver solicitações ou resultados, eles aparecerão somente no contexto selecionado.</p>
      </div>
    </UCard>
  </div>
</template>
