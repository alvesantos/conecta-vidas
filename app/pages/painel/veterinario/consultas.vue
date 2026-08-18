<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Consultas</h1>
        <p class="text-gray-500 text-sm mt-1">Acompanhe suas consultas agendadas</p>
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

    <PainelCareQueue portal="vet" />

    <div class="bg-white rounded-xl shadow">
      <UTable :data="consultations" :columns="columns" :loading="pending" class="w-full">
        <template #date-cell="{ row }">
          <span class="text-gray-800">{{ formatDate(row.original.date) }}</span>
        </template>

        <template #time-cell="{ row }">
          <span class="text-gray-600">{{ formatTime(row.original.time) }}</span>
        </template>

        <template #tutor_name-cell="{ row }">
          <span class="font-medium text-gray-800">{{ row.original.tutor_name }}</span>
        </template>

        <template #pet_name-cell="{ row }">
          <span class="text-gray-600">{{ row.original.pet_name || '—' }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :label="statusLabels[row.original.status] ?? row.original.status"
            :color="(statusBadgeColor[row.original.status] as any) ?? 'neutral'"
            variant="subtle"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <!-- Botão Iniciar Consulta se ainda não iniciada/realizada -->
            <UButton
              v-if="row.original.status === 'agendada' || row.original.status === 'confirmada'"
              size="xs"
              variant="solid"
              color="primary"
              label="Iniciar Consulta"
              icon="i-heroicons-video-camera"
              @click="openConsultation(row.original, true)"
            />

            <!-- Botão Ver Detalhes se já iniciada (ou em andamento no futuro) -->
            <UButton
              size="xs"
              variant="soft"
              color="neutral"
              label="Detalhes"
              icon="i-heroicons-document-text"
              @click="openConsultation(row.original, false)"
            />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400">
            <UIcon name="i-heroicons-calendar-days" class="size-10 mb-2" />
            <p class="text-sm">Nenhuma consulta encontrada.</p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' });

interface Consultation {
  id: string;
  date: string;
  time: string;
  tutor_name: string;
  pet_name: string | null;
  status: string;
  meet_link?: string;
  notes?: string;
}

const { api } = useApi();
const { active, start } = useActiveConsultation();

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

// Recarrega a lista quando uma consulta é finalizada (estado global volta a null).
watch(active, (val, prev) => {
  if (prev && !val) loadConsultations();
});

function openConsultation(consultation: Consultation, autoGenerateLink = false) {
  start(
    {
      id: consultation.id,
      tutor_name: consultation.tutor_name,
      pet_name: consultation.pet_name,
      status: consultation.status,
      meet_link: consultation.meet_link || '',
      notes: consultation.notes || '',
    },
    autoGenerateLink,
  );
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
  if (!dateStr) return '';
  // Correção do bug: .slice(0,10) antes de split
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function formatTime(timeStr: string) {
  if (!timeStr) return '';
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
  { id: 'actions', header: 'Ações' },
];
</script>
