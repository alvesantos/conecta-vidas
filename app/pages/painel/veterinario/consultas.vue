<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' })

interface VetConsultation {
  id: string
  date: string
  time: string
  status: string
  tutor_name: string
  pet_name: string | null
}

const { api } = useApi()
const consultations = ref<VetConsultation[]>([])
const pending = ref(true)
const errorMsg = ref('')
const dateFilter = ref('')

const columns = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'time', header: 'Horário' },
  { accessorKey: 'tutor_name', header: 'Tutor / Cliente' },
  { accessorKey: 'pet_name', header: 'Pet' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: 'Ações' },
]

async function loadConsultations() {
  pending.value = true
  errorMsg.value = ''
  try {
    const query = dateFilter.value ? `?date=${dateFilter.value}` : ''
    consultations.value = await api<VetConsultation[]>(`/vet/consultations${query}`)
  } catch {
    errorMsg.value = 'Não foi possível carregar as consultas veterinárias.'
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
      <h2 class="text-2xl font-bold text-body-strong">Consultas veterinárias</h2>
      <p class="mt-1 text-sm text-body-muted">Somente atendimentos de pets são exibidos neste portal.</p>
    </div>
    <div class="mb-4 flex items-end gap-3">
      <UFormField label="Filtrar por data">
        <UInput v-model="dateFilter" type="date" />
      </UFormField>
      <UButton v-if="dateFilter" label="Limpar" color="neutral" variant="ghost" @click="dateFilter = ''" />
    </div>
    <PainelCareQueue portal="vet" />
    <UAlert v-if="errorMsg" :description="errorMsg" color="error" variant="soft" class="mb-4" />
    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <UTable :data="consultations" :columns="columns" :loading="pending">
        <template #date-cell="{ row }">{{ formatDate(row.original.date) }}</template>
        <template #time-cell="{ row }">{{ row.original.time?.slice(0, 5) }}</template>
        <template #tutor_name-cell="{ row }">{{ row.original.tutor_name }}</template>
        <template #pet_name-cell="{ row }">{{ row.original.pet_name || '—' }}</template>
        <template #status-cell="{ row }"><UBadge :label="row.original.status" color="neutral" variant="soft" class="capitalize" /></template>
        <template #actions-cell="{ row }">
          <UButton
            v-if="row.original.status === 'agendada' || row.original.status === 'confirmada'"
            :to="`/painel/veterinario/atendimento/${row.original.id}`"
            label="Abrir atendimento"
            icon="i-heroicons-video-camera"
            size="xs"
          />
        </template>
        <template #empty><p class="py-10 text-center text-sm text-body-muted">Nenhuma consulta encontrada.</p></template>
      </UTable>
    </UCard>
  </div>
</template>
