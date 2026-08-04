<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' })
const { api } = useApi()
const rows = ref<Array<{ id: string; patient_id: string; patient_name: string; patient_cpf: string; blood_type?: string | null }>>([])
const pending = ref(true)
onMounted(async () => {
  try { rows.value = await api('/medico/records') } finally { pending.value = false }
})
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Prontuários humanos</h1><p class="text-sm text-body-muted">Somente pacientes vinculados às suas consultas médicas.</p></div>
    <USkeleton v-if="pending" class="h-40 rounded-xl" />
    <div v-else-if="rows.length" class="grid gap-4 md:grid-cols-2">
      <NuxtLink v-for="row in rows" :key="row.id" :to="`/painel/medico/prontuarios/${row.id}`">
        <UCard class="transition hover:border-[var(--portal-accent)]">
          <p class="font-semibold text-body-strong">{{ row.patient_name }}</p>
          <p class="mt-1 text-sm text-body-muted">CPF {{ row.patient_cpf }} · Tipo sanguíneo {{ row.blood_type || 'não informado' }}</p>
        </UCard>
      </NuxtLink>
    </div>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhum prontuário humano disponível.</div></UCard>
  </div>
</template>
