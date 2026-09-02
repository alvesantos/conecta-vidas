<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' })

const { api } = useApi()
const pending = ref(true)
const consultations = ref<any[]>([])

const page = ref(1)
const pageCount = 10

onMounted(async () => {
  try {
    const data = await api<any[]>('/medico/consultations')
    // Optionally filter only past/realizada, but let's show all
    consultations.value = data
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
  } finally {
    pending.value = false
  }
})

const columns = [
  { accessorKey: 'date', header: 'Data e Hora' },
  { accessorKey: 'patient_name', header: 'Paciente' },
  { accessorKey: 'status', header: 'Status' },
]

const rows = computed(() => {
  return consultations.value.slice((page.value - 1) * pageCount, page.value * pageCount)
})

const formatDate = (dateStr: string, timeStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
  const formattedDate = format(d, 'dd/MM/yyyy')
  return `${formattedDate} às ${timeStr ? timeStr.substring(0,5) : ''}`
}

const statusColor = (status: string) => {
  switch (status) {
    case 'realizada': return 'success'
    case 'agendada': return 'info'
    case 'cancelada': return 'error'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-body-strong">Histórico de Atendimentos</h1>
      <p class="mt-1 text-sm text-body-muted">Veja todas as suas consultas e atendimentos passados.</p>
    </div>

    <UCard>
      <div v-if="false"></div><div v-else>
        <UTable :data="rows" :columns="columns" :empty-state="{ icon: 'i-heroicons-inbox', label: 'Nenhum atendimento encontrado.' }">
          <template #date-cell="{ row }">
            {{ formatDate(row.original.date, row.original.time) }}
          </template>
          <template #patient_name-cell="{ row }">
            <span class="font-medium text-gray-900">{{ row.original.patient_name }}</span>
          </template>
          <template #status-cell="{ row }">
            <UBadge :color="statusColor(row.original.status)" variant="subtle" class="capitalize">
              {{ row.original.status }}
            </UBadge>
          </template>
        </UTable>

        <div class="flex justify-end mt-4 pt-4 border-t border-gray-100" v-if="consultations.length > 0">
          <UPagination v-model="page" :page-count="pageCount" :total="consultations.length" />
        </div>
      </div>
    </UCard>
  </div>
</template>
