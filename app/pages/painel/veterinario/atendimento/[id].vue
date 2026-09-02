<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' })

const route = useRoute()
const consultationId = computed(() => String(route.params.id))
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-5">
    <div>
      <p class="text-sm font-semibold text-[var(--portal-accent)]">Atendimento médico</p>
      <h1 class="mt-1 text-2xl font-bold text-body-strong">Sala de consulta</h1>
      <p class="mt-1 text-sm text-body-muted">Permita o uso da câmera e do microfone quando o navegador solicitar.</p>
    </div>
    <ConsultationVideoRoom :consultation-id="consultationId" />
    <div class="flex justify-end">
      <UButton to="/painel/veterinario/consultas" label="Voltar para consultas" variant="outline" />
    </div>
  </div>
</template>
