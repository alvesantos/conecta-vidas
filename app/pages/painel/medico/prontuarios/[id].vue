<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' })
const route = useRoute()
const { api } = useApi()
const record = ref<Record<string, string | null> | null>(null)
const pending = ref(true)
onMounted(async () => {
  try { record.value = await api(`/medico/records/${route.params.id}`) } finally { pending.value = false }
})
</script>
<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <USkeleton v-if="pending" class="h-64 rounded-xl" />
    <template v-else-if="record">
      <div><h1 class="text-2xl font-bold text-body-strong">{{ record.patient_name }}</h1><p class="text-sm text-body-muted">Prontuário exclusivamente humano.</p></div>
      <UCard><div class="grid gap-5 sm:grid-cols-2">
        <div><p class="text-xs uppercase text-body-muted">Tipo sanguíneo</p><p>{{ record.blood_type || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase text-body-muted">Alergias</p><p>{{ record.allergies || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase text-body-muted">Comorbidades</p><p>{{ record.comorbidities || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase text-body-muted">Medicamentos contínuos</p><p>{{ record.continuous_medications || 'Não informado' }}</p></div>
      </div></UCard>
    </template>
  </div>
</template>
