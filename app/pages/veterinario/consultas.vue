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

const statusColors: Record<string, string> = {
  agendada: 'bg-blue-100 text-blue-700',
  confirmada: 'bg-yellow-100 text-yellow-700',
  realizada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
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
</script>

<template>
  <div class="max-w-7xl">
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

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :description="errorMsg"
      class="mb-4"
    />

    <div class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Data</th>
            <th class="px-4 py-3 font-medium">Horário</th>
            <th class="px-4 py-3 font-medium">Responsável</th>
            <th class="px-4 py-3 font-medium">Animal</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Carregando...</td>
          </tr>
          <tr v-else-if="consultations.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Nenhuma consulta encontrada.</td>
          </tr>
          <tr v-for="c in consultations" :key="c.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-800">{{ formatDate(c.date) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatTime(c.time) }}</td>
            <td class="px-4 py-3 text-gray-800">{{ c.tutor_name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ c.pet_name || '-' }}</td>
            <td class="px-4 py-3">
              <span
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="statusColors[c.status] ?? 'bg-gray-100 text-gray-600'"
              >
                {{ statusLabels[c.status] ?? c.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton
                v-if="c.status === 'agendada' || c.status === 'confirmada'"
                size="xs"
                variant="soft"
                color="primary"
                label="Marcar como realizada"
                :loading="updatingId === c.id"
                @click="markAsRealizada(c)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
