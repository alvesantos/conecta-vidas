<script setup lang="ts">
definePageMeta({ layout: 'backoffice', middleware: 'admin' });

interface ConsultationRow {
  id: string;
  date: string;
  time: string;
  status: string;
  notes: string;
  vet_id: string | null;
  tutor_name: string;
  pet_name: string | null;
  selectedVet?: string;
}

const { api } = useApi();
const toast = useToast();

const consultations = ref<ConsultationRow[]>([]);
const vets = ref<{ id: string; name: string }[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadData() {
  pending.value = true;
  errorMsg.value = '';
  try {
    const [consultationsRes, vetsRes] = await Promise.all([
      api<ConsultationRow[]>('/admin/consultations'),
      api<{ id: string; name: string }[]>('/users/vets')
    ]);
    consultations.value = consultationsRes;
    vets.value = vetsRes;
  } catch {
    errorMsg.value = 'Erro ao carregar dados.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadData);

const assigningId = ref<string | null>(null);

async function assignVet(consultationId: string, vetId: string) {
  if (!vetId) return;
  assigningId.value = consultationId;
  try {
    await api(`/admin/consultations/${consultationId}/assign`, {
      method: 'PATCH',
      body: { vet_id: vetId }
    });
    toast.add({ title: 'Atribuído!', description: 'Veterinário designado com sucesso.', color: 'success' });
    await loadData();
  } catch {
    toast.add({ title: 'Erro', description: 'Não foi possível designar veterinário.', color: 'error' });
  } finally {
    assigningId.value = null;
  }
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

const statusLabels: Record<string, string> = {
  agendada: 'Agendada',
  confirmada: 'Confirmada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
};

const statusBadgeColor: Record<string, string> = {
  agendada: 'info',
  confirmada: 'warning',
  realizada: 'success',
  cancelada: 'error',
};

const columns = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'time', header: 'Horário' },
  { accessorKey: 'tutor_name', header: 'Responsável' },
  { accessorKey: 'pet_name', header: 'Animal' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'assignment', header: 'Veterinário' }
];
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Consultas Agendadas</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
        Acompanhe e direcione as consultas para os veterinários.
      </p>
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <UTable :data="consultations" :columns="columns" :loading="pending" class="w-full">
        <template #date-cell="{ row }">
          <span class="text-gray-800 dark:text-gray-100">{{ formatDate(row.original.date) }}</span>
        </template>
        
        <template #time-cell="{ row }">
          <span class="text-gray-800 dark:text-gray-100">{{ row.original.time.slice(0, 5) }}</span>
        </template>

        <template #tutor_name-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ row.original.tutor_name }}</span>
        </template>

        <template #pet_name-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ row.original.pet_name || '—' }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :label="statusLabels[row.original.status] ?? row.original.status"
            :color="(statusBadgeColor[row.original.status] as any) ?? 'neutral'"
            variant="subtle"
          />
        </template>

        <template #assignment-cell="{ row }">
          <div class="flex items-center gap-2" v-if="!row.original.vet_id">
            <USelect
              v-model="row.original.selectedVet"
              :options="vets"
              option-attribute="name"
              value-attribute="id"
              placeholder="Selecionar..."
              size="sm"
            />
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              :disabled="!row.original.selectedVet"
              :loading="assigningId === row.original.id"
              @click="assignVet(row.original.id, row.original.selectedVet)"
            >
              Atribuir
            </UButton>
          </div>
          <div v-else>
            <span class="text-sm font-medium text-green-600 dark:text-green-400">Atribuída</span>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <UIcon name="i-heroicons-calendar-days" class="size-10 mb-2" />
            <p class="text-sm">Nenhuma consulta agendada.</p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
