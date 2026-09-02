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

const rows = ref<PrescriptionRow[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadPrescriptions() {
  pending.value = true;
  try {
    rows.value = await api<PrescriptionRow[]>('/vet/prescriptions');
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
    rows.value = rows.value.filter((p) => p.id !== id);
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
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-body-strong">Prescrições veterinárias</h1>
        <p class="text-sm text-body-muted">Prescrições emitidas para os pets.</p>
      </div>
      <UButton to="/painel/veterinario/prescricoes/nova" label="Nova prescrição" icon="i-heroicons-plus" />
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" />

    <USkeleton v-if="pending" class="h-40 rounded-xl" />
    <div v-else-if="rows.length" class="grid gap-4 md:grid-cols-2">
      <UCard v-for="row in rows" :key="row.id">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold text-body-strong">{{ row.responsible_name }}</p>
            <p class="text-xs text-body-muted">{{ row.pet_name || 'Pet não informado' }}</p>
          </div>
          <div class="flex gap-2">
            <UButton size="xs" variant="ghost" color="primary" icon="i-heroicons-arrow-down-tray" :loading="downloadingId === row.id" @click="downloadPdf(row.id)" />
            <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash" :loading="deletingId === row.id" @click="confirmDeleteId = row.id" />
          </div>
        </div>
        <p class="mt-2 line-clamp-3 whitespace-pre-line text-sm text-body-muted">{{ row.content }}</p>
        <p class="mt-4 text-xs text-body-muted">{{ formatDate(row.date) }}</p>
      </UCard>
    </div>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhuma prescrição emitida.</div></UCard>

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
