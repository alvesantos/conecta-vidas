<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' })

interface MedicalConsultation {
  id: string
  date: string
  time: string
  status: string
  patient_name: string
}

const { api } = useApi()
const consultations = ref<MedicalConsultation[]>([])
const pending = ref(true)
const errorMsg = ref('')
const dateFilter = ref('')

const columns = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'time', header: 'Horário' },
  { accessorKey: 'patient_name', header: 'Paciente' },
  { accessorKey: 'status', header: 'Status' },
]

async function loadConsultations() {
  pending.value = true
  errorMsg.value = ''
  try {
    const query = dateFilter.value ? `?date=${dateFilter.value}` : ''
    consultations.value = await api<MedicalConsultation[]>(`/medico/consultations${query}`)
  } catch {
    errorMsg.value = 'Não foi possível carregar as consultas médicas.'
  } finally {
    pending.value = false
  }
}

onMounted(loadConsultations)
watch(dateFilter, loadConsultations)

function formatDate(value: string) {
  if (!value) return '—'
  const [year, month, day] = value.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-body-strong">Consultas médicas</h2>
      <p class="mt-1 text-sm text-body-muted">Somente atendimentos humanos são exibidos neste portal.</p>
    </div>
    <div class="mb-4 flex items-end gap-3">
      <UFormField label="Filtrar por data">
        <UInput v-model="dateFilter" type="date" />
      </UFormField>
      <UButton v-if="dateFilter" label="Limpar" color="neutral" variant="ghost" @click="dateFilter = ''" />
    </div>
    <UAlert v-if="errorMsg" :description="errorMsg" color="error" variant="soft" class="mb-4" />
    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <UTable :data="consultations" :columns="columns" :loading="pending">
        <template #date-cell="{ row }">{{ formatDate(row.original.date) }}</template>
        <template #time-cell="{ row }">{{ row.original.time?.slice(0, 5) }}</template>
        <template #status-cell="{ row }"><UBadge :label="row.original.status" color="neutral" variant="soft" /></template>
        <template #empty><p class="py-10 text-center text-sm text-body-muted">Nenhuma consulta encontrada.</p></template>
      </UTable>
    </UCard>
  </div>
</template>
