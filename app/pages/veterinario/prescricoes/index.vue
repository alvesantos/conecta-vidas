<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });

interface PrescriptionRow {
  id: string;
  date: string;
  created_at: string;
  responsible_name: string;
  pet_name: string | null;
  content: string;
}

const { api } = useApi();

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

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function excerpt(text: string) {
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}
</script>

<template>
  <div class="max-w-5xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Prescrições</h1>
        <p class="text-gray-500 text-sm mt-1">Crie e consulte as prescrições emitidas</p>
      </div>
      <UButton
        label="Nova Prescrição"
        icon="i-heroicons-plus"
        color="primary"
        to="/veterinario/prescricoes/nova"
      />
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />

    <div class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Data</th>
            <th class="px-4 py-3 font-medium">Responsável</th>
            <th class="px-4 py-3 font-medium">Animal</th>
            <th class="px-4 py-3 font-medium">Prescrição</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending">
            <td colspan="4" class="px-4 py-8 text-center text-gray-400">Carregando...</td>
          </tr>
          <tr v-else-if="prescriptions.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-gray-400">
              Nenhuma prescrição emitida ainda.
            </td>
          </tr>
          <tr v-for="p in prescriptions" :key="p.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-800">{{ formatDate(p.date) }}</td>
            <td class="px-4 py-3 text-gray-800">{{ p.responsible_name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ p.pet_name || '—' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ excerpt(p.content) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
