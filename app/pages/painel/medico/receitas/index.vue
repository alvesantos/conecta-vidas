<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' })
const { api } = useApi()
const rows = ref<Array<{ id: string; patient_name: string; content: string; date: string }>>([])
const pending = ref(true)
onMounted(async () => {
  try { rows.value = await api('/medico/prescriptions') } finally { pending.value = false }
})
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div><h1 class="text-2xl font-bold text-body-strong">Receitas médicas</h1><p class="text-sm text-body-muted">Prescrições exclusivamente humanas.</p></div>
      <UButton to="/painel/medico/receitas/nova" label="Nova receita" icon="i-heroicons-plus" />
    </div>
    <USkeleton v-if="pending" class="h-40 rounded-xl" />
    <div v-else-if="rows.length" class="grid gap-4 md:grid-cols-2">
      <UCard v-for="row in rows" :key="row.id">
        <p class="font-semibold text-body-strong">{{ row.patient_name }}</p>
        <p class="mt-2 line-clamp-3 whitespace-pre-line text-sm text-body-muted">{{ row.content }}</p>
        <p class="mt-4 text-xs text-body-muted">{{ new Date(`${row.date.slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR') }}</p>
      </UCard>
    </div>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhuma receita emitida.</div></UCard>
  </div>
</template>
