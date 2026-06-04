<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="ghost"
        to="/veterinario/prontuarios"
      />
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {{ records.length > 0 ? records[0]?.tutor_name : 'Prontuários' }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Histórico de Consultas
        </p>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin size-8 text-primary" />
    </div>
    <UAlert v-else-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />
    <div v-else-if="records.length === 0" class="text-center py-12 text-gray-500">
      Nenhum prontuário encontrado para este responsável.
    </div>

    <div v-else class="space-y-6">
      <UCard v-for="record in records" :key="record.id" class="overflow-visible">
        <template #header>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100">
                Consulta em {{ formatDate(record.consultation_date) }} às {{ record.consultation_time.slice(0, 5) }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Paciente: <span class="font-medium text-gray-700 dark:text-gray-300">{{ record.pet_name || 'Não informado' }}</span>
                <span v-if="record.pet_species"> ({{ record.pet_species }} - {{ record.pet_breed || 'Sem raça definida' }})</span>
              </p>
            </div>
            <UButton
              color="primary"
              size="sm"
              icon="i-heroicons-check"
              :loading="savingId === record.id"
              @click="saveRecord(record)"
            >
              Salvar Alterações
            </UButton>
          </div>
        </template>

        <div class="flex flex-col gap-4">
          <div v-if="record.consultation_notes" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-300">
            <span class="font-semibold block mb-1">Motivo / Notas da Consulta:</span>
            {{ record.consultation_notes }}
          </div>
          
          <UFormField label="Prontuário (Observações, Prescrições e Exames)">
            <UTextarea
              v-model="record.content"
              :rows="6"
              placeholder="Digite aqui as anotações do prontuário..."
            />
          </UFormField>
          
          <div class="flex items-center gap-3">
             <UButton color="neutral" variant="soft" icon="i-heroicons-paper-clip" disabled>
               Anexar Arquivo (Em breve)
             </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });

const route = useRoute();
const tutorId = route.params.id as string;
const { api } = useApi();
const toast = useToast();

interface MedicalRecordDetail {
  id: string;
  content: string;
  created_at: string;
  consultation_date: string;
  consultation_time: string;
  consultation_notes: string;
  tutor_name: string;
  pet_name: string | null;
  pet_species: string | null;
  pet_breed: string | null;
}

const records = ref<MedicalRecordDetail[]>([]);
const pending = ref(true);
const errorMsg = ref('');
const savingId = ref<string | null>(null);

async function loadRecords() {
  pending.value = true;
  errorMsg.value = '';
  try {
    records.value = await api<MedicalRecordDetail[]>(`/vet/medical-records/tutor/${tutorId}`);
  } catch {
    errorMsg.value = 'Erro ao carregar prontuários do responsável.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadRecords);

async function saveRecord(record: MedicalRecordDetail) {
  savingId.value = record.id;
  try {
    await api(`/vet/medical-records/${record.id}`, {
      method: 'PUT',
      body: { content: record.content }
    });
    toast.add({ title: 'Salvo', description: 'Prontuário atualizado com sucesso.', color: 'success' });
  } catch {
    toast.add({ title: 'Erro', description: 'Falha ao salvar.', color: 'error' });
  } finally {
    savingId.value = null;
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
</script>
