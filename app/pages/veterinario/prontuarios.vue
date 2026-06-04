<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });

const { api } = useApi();
const toast = useToast();

interface MedicalRecordRow {
  id: string;
  created_at: string;
  consultation_date: string;
  tutor_name: string;
  pet_name: string | null;
}

const records = ref<MedicalRecordRow[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadRecords() {
  pending.value = true;
  errorMsg.value = '';
  try {
    records.value = await api<MedicalRecordRow[]>('/vet/medical-records');
  } catch {
    errorMsg.value = 'Erro ao carregar prontuários.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadRecords);

const isOpen = ref(false);
const loadingDetail = ref(false);
const detailId = ref<string | null>(null);
const detailContent = ref('');
const isSaving = ref(false);

async function openRecord(id: string) {
  detailId.value = id;
  isOpen.value = true;
  loadingDetail.value = true;
  try {
    const data = await api<{ content: string }>(`/vet/medical-records/${id}`);
    detailContent.value = data.content || '';
  } catch {
    toast.add({ title: 'Erro', description: 'Não foi possível carregar o prontuário.', color: 'error' });
    isOpen.value = false;
  } finally {
    loadingDetail.value = false;
  }
}

async function saveRecord() {
  if (!detailId.value) return;
  isSaving.value = true;
  try {
    await api(`/vet/medical-records/${detailId.value}`, {
      method: 'PUT',
      body: { content: detailContent.value }
    });
    toast.add({ title: 'Salvo', description: 'Prontuário atualizado com sucesso.', color: 'success' });
    isOpen.value = false;
  } catch {
    toast.add({ title: 'Erro', description: 'Falha ao salvar.', color: 'error' });
  } finally {
    isSaving.value = false;
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

const columns = [
  { accessorKey: 'consultation_date', header: 'Data da Consulta' },
  { accessorKey: 'tutor_name', header: 'Responsável' },
  { accessorKey: 'pet_name', header: 'Animal' },
  { id: 'actions', header: '' },
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Prontuários</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Prontuários gerados automaticamente após a finalização de uma consulta.
        </p>
      </div>
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <UTable :data="records" :columns="columns" :loading="pending" class="w-full">
        <template #consultation_date-cell="{ row }">
          <span class="text-gray-800 dark:text-gray-100 font-medium">
            {{ formatDate(row.original.consultation_date) }}
          </span>
        </template>
        <template #tutor_name-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ row.original.tutor_name }}</span>
        </template>
        <template #pet_name-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ row.original.pet_name || '—' }}</span>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              icon="i-heroicons-eye"
              label="Visualizar"
              @click="openRecord(row.original.id)"
            />
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <UIcon name="i-heroicons-clipboard-document-list" class="size-10 mb-2" />
            <p class="text-sm">Nenhum prontuário encontrado.</p>
          </div>
        </template>
      </UTable>
    </div>

    <UModal v-model="isOpen" :ui="{ content: 'sm:max-w-3xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Detalhes do Prontuário</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isOpen = false" />
          </div>
        </template>

        <div v-if="loadingDetail" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin size-8 text-primary" />
        </div>
        <div v-else class="flex flex-col gap-4">
          <UFormField label="Conteúdo do Prontuário">
            <UTextarea v-model="detailContent" :rows="12" placeholder="Descreva o atendimento, diagnóstico, exames..." />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" @click="isOpen = false">Cancelar</UButton>
            <UButton color="primary" @click="saveRecord" :loading="isSaving">Salvar Alterações</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
