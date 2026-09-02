<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' })

const { api } = useApi();

interface TutorRecord {
  tutor_id: string;
  tutor_name: string;
  last_consultation_date: string;
}

const rows = ref<TutorRecord[]>([]);
const pending = ref(true);
onMounted(async () => {
  try {
    rows.value = await api<TutorRecord[]>('/vet/medical-records/tutors');
  } finally {
    pending.value = false;
  }
});

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-body-strong">Prontuários veterinários</h1>
      <p class="text-sm text-body-muted">Acompanhe o histórico de consultas vinculadas a você.</p>
    </div>
    <USkeleton v-if="pending" class="h-40 rounded-xl" />
    <div v-else-if="rows.length" class="grid gap-4 md:grid-cols-2">
      <NuxtLink v-for="row in rows" :key="row.tutor_id" :to="`/painel/veterinario/prontuarios/${row.tutor_id}`">
        <UCard class="transition hover:border-[var(--portal-accent)]">
          <p class="font-semibold text-body-strong">{{ row.tutor_name }}</p>
          <p class="mt-1 text-sm text-body-muted">Última consulta: {{ formatDate(row.last_consultation_date) }}</p>
        </UCard>
      </NuxtLink>
    </div>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhum prontuário veterinário disponível.</div></UCard>
  </div>
</template>
