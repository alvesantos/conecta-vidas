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
              @click="openConsultationDetails(row.original, true)"
            />
            
            <!-- Botão Ver Detalhes se já iniciada (ou em andamento no futuro) -->
            <UButton
              size="xs"
              variant="soft"
              color="neutral"
              label="Detalhes"
              icon="i-heroicons-document-text"
              @click="openConsultationDetails(row.original, false)"
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

    <!-- Modal Detalhes da Consulta (com bloco de notas e Link) -->
    <Teleport to="body">
      <div v-if="isDetailsModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="isDetailsModalOpen = false"></div>
        
        <UCard class="relative w-full max-w-3xl shadow-2xl z-10 flex flex-col max-h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <UIcon name="i-heroicons-video-camera" class="text-primary size-6" />
                Sala de Consulta
              </h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isDetailsModalOpen = false" />
            </div>
          </template>

          <div class="flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
            <!-- Info do Paciente e Tutor -->
            <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tutor (Responsável)</p>
                <p class="text-base font-medium text-gray-800 dark:text-gray-100">{{ selectedConsultation?.tutor_name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Paciente (Pet)</p>
                <p class="text-base font-medium text-gray-800 dark:text-gray-100">{{ selectedConsultation?.pet_name || '—' }}</p>
              </div>
            </div>

            <!-- Meet Link -->
            <div class="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p class="font-semibold text-primary dark:text-primary-400">Videoconferência</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  <span v-if="meetLink">Link gerado: <a :href="meetLink" target="_blank" class="underline font-medium break-all">{{ meetLink }}</a></span>
                  <span v-else>Link da sala não gerado ainda.</span>
                </p>
              </div>
              <UButton
                v-if="!meetLink"
                color="primary"
                label="Gerar Link"
                icon="i-heroicons-link"
                :loading="generatingLink"
                @click="generateMeetLink"
              />
              <UButton
                v-else
                color="primary"
                variant="solid"
                label="Entrar na Sala"
                icon="i-heroicons-arrow-right-circle"
                :to="meetLink"
                target="_blank"
              />
            </div>

            <!-- Bloco de Notas / Prontuário Ao Vivo -->
            <div class="flex flex-col gap-2 h-64">
              <label class="font-semibold text-gray-700 dark:text-gray-200">Anotações (Evolução / Prontuário)</label>
              <UTextarea
                v-model="liveNotes"
                placeholder="Digite livremente durante a consulta..."
                class="w-full flex-1"
                textarea-class="h-full resize-none"
              />
              <p class="text-xs text-gray-500 mt-1">Suas anotações serão salvas automaticamente ao finalizar a consulta.</p>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4">
              <UButton color="neutral" variant="soft" @click="isDetailsModalOpen = false">Fechar</UButton>
              <UButton
                color="success"
                icon="i-heroicons-check-badge"
                label="Finalizar Consulta"
                :disabled="selectedConsultation?.status === 'realizada'"
                :loading="updatingId === selectedConsultation?.id"
                @click="markAsRealizada(selectedConsultation!)"
              />
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });

interface Consultation {
  id: string;
  date: string;
  time: string;
  tutor_name: string;
  pet_name: string | null;
  status: string;
  meet_link?: string;
}

const { api } = useApi();
const toast = useToast();

const consultations = ref<Consultation[]>([]);
const pending = ref(true);
const errorMsg = ref('');
const dateFilter = ref('');

// Modal details
const isDetailsModalOpen = ref(false);
const selectedConsultation = ref<Consultation | null>(null);
const liveNotes = ref('');
const meetLink = ref('');
const generatingLink = ref(false);

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

function openConsultationDetails(consultation: Consultation, autoGenerateLink: boolean = false) {
  selectedConsultation.value = consultation;
  // TODO: Em breve o meet_link virá da API na consulta, por enquanto estamos simulando.
  meetLink.value = consultation.meet_link || ''; 
  liveNotes.value = ''; // TODO: carregar anotações salvas se houver rascunho
  isDetailsModalOpen.value = true;

  if (autoGenerateLink && !meetLink.value) {
    generateMeetLink();
  }
}

async function generateMeetLink() {
  if (!selectedConsultation.value) return;
  generatingLink.value = true;
  try {
    // Simulando a geração do link do Meet (Jitsi)
    await new Promise(r => setTimeout(r, 1000));
    const fakeRoomName = `ConectaVet-${selectedConsultation.value.id.slice(0, 8)}`;
    meetLink.value = `https://meet.jit.si/${fakeRoomName}`;
    toast.add({ title: 'Link Gerado!', description: 'A sala de videoconferência foi criada.', color: 'success' });
  } catch {
    toast.add({ title: 'Erro', description: 'Falha ao gerar link do Meet.', color: 'error' });
  } finally {
    generatingLink.value = false;
  }
}

const updatingId = ref<string | null>(null);

async function markAsRealizada(consultation: Consultation) {
  updatingId.value = consultation.id;
  try {
    // TODO: Enviar liveNotes.value para salvar no Medical Record
    await api(`/vet/consultations/${consultation.id}/status`, {
      method: 'PATCH',
      body: { status: 'realizada' },
    });
    toast.add({ title: 'Sucesso', description: 'Consulta finalizada e prontuário gerado.', color: 'success' });
    isDetailsModalOpen.value = false;
    await loadConsultations();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    toast.add({ title: 'Erro', description: fetchErr?.data?.error ?? 'Erro ao finalizar consulta.', color: 'error' });
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
