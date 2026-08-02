<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Prontuários</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Acompanhe o histórico de consultas de cada cliente
        </p>
      </div>
    </div>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mb-4" />

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <UTable :data="tutors" :columns="columns" :loading="pending" class="w-full">
        <template #tutor_name-cell="{ row }">
          <span class="text-gray-800 dark:text-gray-100 font-medium">{{ row.original.tutor_name }}</span>
        </template>
        
        <template #last_consultation_date-cell="{ row }">
          <span class="text-gray-600 dark:text-gray-300">
            {{ formatDate(row.original.last_consultation_date) }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              icon="i-heroicons-arrow-right"
              :to="`/painel/veterinario/prontuarios/${row.original.tutor_id}`"
            />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <UIcon name="i-heroicons-users" class="size-10 mb-2" />
            <p class="text-sm">Nenhum responsável encontrado.</p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' });

const { api } = useApi();

interface TutorRecord {
  tutor_id: string;
  tutor_name: string;
  last_consultation_date: string;
}

const tutors = ref<TutorRecord[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadTutors() {
  pending.value = true;
  errorMsg.value = '';
  try {
    tutors.value = await api<TutorRecord[]>('/vet/medical-records/tutors');
  } catch {
    errorMsg.value = 'Erro ao carregar lista de responsáveis.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadTutors);

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

const columns = [
  { accessorKey: 'tutor_name', header: 'Responsável' },
  { accessorKey: 'last_consultation_date', header: 'Última Consulta' },
  { id: 'actions', header: '' },
];
</script>
