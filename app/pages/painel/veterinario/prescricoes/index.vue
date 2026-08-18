<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' });

interface PrescriptionRow {
  id: string;
  date: string;
  created_at: string;
  responsible_name: string;
  pet_name: string | null;
  content: string;
}

const { api } = useApi();
const toast = useToast();

const prescriptions = ref<PrescriptionRow[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadPrescriptions() {
  pending.value = true;
  try {
    prescriptions.value = await api<PrescriptionRow[]>('/vet/prescriptions');
  } catch {
    errorMsg.value = 'Erro ao carregar prescrições.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadPrescriptions);

interface PrescriptionDetail {
  content: string;
  date: string;
  responsible_name: string | null;
  responsible_cpf: string | null;
  responsible_email: string | null;
  responsible_address: string | null;
  vet_name: string | null;
  vet_crmv: string | null;
  pet_name: string | null;
  pet_species: string | null;
  pet_breed: string | null;
  pet_sex: string | null;
  pet_size: string | null;
  pet_weight: number | string | null;
  pet_coat: string | null;
  pet_coat_color: string | null;
  pet_birth_date: string | null;
}

const downloadingId = ref<string | null>(null);

async function downloadPdf(id: string) {
  downloadingId.value = id;
  errorMsg.value = '';
  try {
    const d = await api<PrescriptionDetail>(`/vet/prescriptions/${id}`);
    await downloadPrescriptionPdf({
      vetName: d.vet_name,
      vetCrmv: d.vet_crmv,
      date: d.date,
      content: d.content,
      responsibleName: d.responsible_name,
      responsibleCpf: d.responsible_cpf,
      responsibleEmail: d.responsible_email,
      responsibleAddress: d.responsible_address,
      animal: d.pet_name
        ? {
            name: d.pet_name,
            species: d.pet_species,
            breed: d.pet_breed,
            sex: d.pet_sex,
            size: d.pet_size,
            weight: d.pet_weight,
            coat: d.pet_coat,
            coatColor: d.pet_coat_color,
            birthDate: d.pet_birth_date,
          }
        : null,
    });
  } catch {
    errorMsg.value = 'Erro ao gerar o PDF.';
  } finally {
    downloadingId.value = null;
  }
}

const deletingId = ref<string | null>(null);
const confirmDeleteId = ref<string | null>(null);

async function removePrescription(id: string) {
  deletingId.value = id;
  errorMsg.value = '';
  try {
    await api(`/vet/prescriptions/${id}`, { method: 'DELETE' });
    prescriptions.value = prescriptions.value.filter((p) => p.id !== id);
    toast.add({ title: 'Prescrição removida', color: 'success' });
  } catch {
    toast.add({ title: 'Erro', description: 'Erro ao remover a prescrição.', color: 'error' });
  } finally {
    deletingId.value = null;
    confirmDeleteId.value = null;
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function excerpt(text: string) {
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}

const columns = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'responsible_name', header: 'Responsável' },
  { accessorKey: 'pet_name', header: 'Pet' },
  { accessorKey: 'content', header: 'Prescrição' },
  { id: 'actions', header: '' },
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Prescrições</h1>
        <p class="text-gray-500 text-sm mt-1">Crie e consulte as prescrições emitidas</p>
      </div>
      <UButton
        label="Nova Prescrição"
        icon="i-heroicons-plus"
        color="primary"

        to="/painel/veterinario/prescricoes/nova"
      />
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />

    <div class="bg-white rounded-xl shadow">
      <UTable :data="prescriptions" :columns="columns" :loading="pending" class="w-full">
        <template #date-cell="{ row }">
          <span class="text-gray-800">{{ formatDate(row.original.date) }}</span>
        </template>

        <template #responsible_name-cell="{ row }">
          <span class="font-medium text-gray-800">{{ row.original.responsible_name }}</span>
        </template>

        <template #pet_name-cell="{ row }">
          <span class="text-gray-600">{{ row.original.pet_name || '—' }}</span>
        </template>

        <template #content-cell="{ row }">
          <span class="text-gray-600">{{ excerpt(row.original.content) }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <UButton
              size="xs"
              variant="soft"
              color="primary"
              icon="i-heroicons-arrow-down-tray"
              label="Baixar PDF"

              :loading="downloadingId === row.original.id"
              @click="downloadPdf(row.original.id)"
            />
            <UButton
              size="xs"
              variant="soft"
              color="error"
              icon="i-heroicons-trash"
              :loading="deletingId === row.original.id"
              title="Remover prescrição"
              @click="confirmDeleteId = row.original.id"
            />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400">
            <UIcon name="i-heroicons-document-text" class="size-10 mb-2" />
            <p class="text-sm">Nenhuma prescrição emitida ainda.</p>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Confirmação de remoção -->
    <Teleport to="body">
      <div v-if="confirmDeleteId" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="confirmDeleteId = null"></div>
        <UCard class="relative w-full max-w-md shadow-2xl z-10">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-800">Remover prescrição</h3>
          </template>
          <p class="text-gray-600">
            Tem certeza que deseja remover esta prescrição? Esta ação não pode ser desfeita.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="soft" label="Cancelar" @click="confirmDeleteId = null" />
              <UButton
                color="error"
                label="Remover"
                icon="i-heroicons-trash"
                :loading="deletingId === confirmDeleteId"
                @click="removePrescription(confirmDeleteId!)"
              />
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>
  </div>
</template>
