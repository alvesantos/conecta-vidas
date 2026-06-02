<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });

interface Consultation {
  id: string;
  date: string;
  time: string;
  tutor_name: string;
  pet_name: string | null;
  status: string;
}

const { api } = useApi();

const consultations = ref<Consultation[]>([]);
const pending = ref(true);
const errorMsg = ref('');
const dateFilter = ref('');

async function loadConsultations() {
  pending.value = true;
  errorMsg.value = '';
  try {
    const params = dateFilter.value ? `?date=${dateFilter.value}` : '';
    consultations.value = await api<Consultation[]>(`/vet/consultations${params}`);
  } catch {
    errorMsg.value = 'Erro ao carregar consultas.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadConsultations);
watch(dateFilter, () => loadConsultations());

const updatingId = ref<string | null>(null);

async function markAsRealizada(consultation: Consultation) {
  updatingId.value = consultation.id;
  try {
    await api(`/vet/consultations/${consultation.id}/status`, {
      method: 'PATCH',
      body: { status: 'realizada' },
    });
    await loadConsultations();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    errorMsg.value = fetchErr?.data?.error ?? 'Erro ao atualizar consulta.';
  } finally {
    updatingId.value = null;
  }
}

const statusBadgeColor: Record<string, string> = {
  agendada: 'info',
  confirmada: 'warning',
  realizada: 'success',
  cancelada: 'error',
};

const statusLabels: Record<string, string> = {
  agendada: 'Agendada',
  confirmada: 'Confirmada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatTime(timeStr: string) {
  return timeStr.slice(0, 5);
}

function clearFilter() {
  dateFilter.value = '';
}

const columns = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'time', header: 'Horário' },
  { accessorKey: 'tutor_name', header: 'Responsável' },
  { accessorKey: 'pet_name', header: 'Animal' },
  { id: 'status', header: 'Status' },
  { id: 'actions', header: '' },
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Consultas</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Acompanhe suas consultas agendadas</p>
      </div>
    </div>

    <div class="flex items-end gap-3 mb-4">
      <UFormField label="Filtrar por data">
        <UInput v-model="dateFilter" type="date" />
      </UFormField>
      <UButton
        v-if="dateFilter"
        variant="ghost"
        color="neutral"
        label="Limpar"
        size="sm"
        @click="clearFilter"
      />
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <UTable :data="consultations" :columns="columns" :loading="pending" class="w-full">
        <template #date-cell="{ row }">
          <span class="text-gray-800 dark:text-gray-100">{{ formatDate(row.original.date) }}</span>
        </template>

        <template #time-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ formatTime(row.original.time) }}</span>
        </template>

        <template #tutor_name-cell="{ row }">
          <span class="font-medium text-gray-800 dark:text-gray-100">{{ row.original.tutor_name }}</span>
        </template>

        <template #pet_name-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ row.original.pet_name || '—' }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :label="statusLabels[row.original.status] ?? row.original.status"
            :color="statusBadgeColor[row.original.status] ?? 'neutral'"
            variant="subtle"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UButton
              v-if="row.original.status === 'agendada' || row.original.status === 'confirmada'"
              size="xs"
              variant="soft"
              color="primary"
              label="Marcar como realizada"
              class="dark:text-white"
              :loading="updatingId === row.original.id"
              @click="markAsRealizada(row.original)"
            />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <UIcon name="i-heroicons-calendar-days" class="size-10 mb-2" />
            <p class="text-sm">Nenhuma consulta encontrada.</p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
