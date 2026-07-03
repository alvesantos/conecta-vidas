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
          <div v-if="!row.original.vet_id">
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              @click="openAssignModal(row.original)"
            >
              Atribuir
            </UButton>
          </div>
          <div v-else>
            <div class="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-check-circle-solid" class="size-4" />
              <span class="text-sm font-medium">{{ row.original.vet_name || 'Atribuída' }}</span>
            </div>
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

    <!-- Modal de Atribuição -->
    <Teleport to="body">
      <div v-if="isAssignModalOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="isAssignModalOpen = false"></div>
        
        <UCard class="relative w-full max-w-lg shadow-2xl z-10 flex flex-col max-h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Atribuir Veterinário</h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isAssignModalOpen = false" />
            </div>
          </template>

          <div class="flex flex-col gap-4 overflow-y-auto">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Consulta solicitada por <strong>{{ selectedConsultationForModal?.tutor_name }}</strong>.
            </p>
            
            <div class="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
              <div
                v-for="vet in vets"
                :key="vet.id"
                class="border rounded-lg p-4 cursor-pointer transition-all flex flex-col gap-1"
                :class="selectedVetIdForModal === vet.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                @click="selectedVetIdForModal = vet.id"
              >
                <div class="flex items-center justify-between">
                  <p class="font-medium text-gray-800 dark:text-gray-100">{{ vet.name }}</p>
                  <UIcon v-if="selectedVetIdForModal === vet.id" name="i-heroicons-check-circle-solid" class="text-primary dark:text-white size-5" />
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 flex flex-col">
                  <span><strong>CRMV:</strong> {{ vet.crmv || 'Não informado' }}</span>
                  <span><strong>E-mail:</strong> {{ vet.email || 'Não informado' }}</span>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3 pt-2">
              <UButton color="neutral" variant="soft" @click="isAssignModalOpen = false">Cancelar</UButton>
              <UButton
                color="primary"
                :disabled="!selectedVetIdForModal"
                :loading="assigningId === selectedConsultationForModal?.id"
                @click="confirmAssignment"
              >
                Confirmar Atribuição
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>

  </div>
</template>

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
  vet_name?: string;
}

interface Vet {
  id: string;
  name: string;
  email?: string;
  crmv?: string;
}

const { api } = useApi();
const toast = useToast();

const consultations = ref<ConsultationRow[]>([]);
const vets = ref<Vet[]>([]);
const pending = ref(true);
const errorMsg = ref('');

// Modal State
const isAssignModalOpen = ref(false);
const selectedConsultationForModal = ref<ConsultationRow | null>(null);
const selectedVetIdForModal = ref<string>('');

const selectedVetDetails = computed(() => {
  if (!selectedVetIdForModal.value) return null;
  return vets.value.find(v => v.id === selectedVetIdForModal.value) || null;
});

function openAssignModal(row: ConsultationRow) {
  selectedConsultationForModal.value = row;
  selectedVetIdForModal.value = '';
  isAssignModalOpen.value = true;
}

async function confirmAssignment() {
  if (!selectedConsultationForModal.value || !selectedVetIdForModal.value) return;
  await assignVet(selectedConsultationForModal.value.id, selectedVetIdForModal.value);
}

async function loadData() {
  pending.value = true;
  errorMsg.value = '';
  try {
    const [consultationsRes, vetsRes] = await Promise.all([
      api<ConsultationRow[]>('/admin/consultations'),
      api<Vet[]>('/users/vets')
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
  assigningId.value = consultationId;
  try {
    await api(`/admin/consultations/${consultationId}/assign`, {
      method: 'PATCH',
      body: { vet_id: vetId }
    });
    toast.add({ title: 'Atribuído!', description: 'Veterinário designado com sucesso.', color: 'success' });
    isAssignModalOpen.value = false;
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
