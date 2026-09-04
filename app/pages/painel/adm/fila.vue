<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

interface QueueItem {
  id: string;
  consultation_id: string;
  kind: 'humano' | 'veterinario';
  status: 'aguardando' | 'chamado' | 'em_atendimento';
  priority: number;
  joined_at: string;
  called_at: string | null;
  owner_name: string;
  pet_name: string | null;
  dependent_name: string | null;
  professional_name: string | null;
  professional_id: string | null;
  triage: { description: string | null; recommendation: string | null; symptoms: { label: string; severity: string }[] } | null;
}

interface Professional {
  id: string;
  name: string;
  available_now: boolean;
  available_since: string | null;
}

const { api } = useApi();
const toast = useToast();

const queue = ref<QueueItem[]>([]);
const professionals = ref<{ humano: Professional[]; veterinario: Professional[] }>({ humano: [], veterinario: [] });
const pending = ref(true);
const assigning = ref<string | null>(null);
const selectedProfessional = reactive<Record<string, string>>({});
let interval: ReturnType<typeof setInterval> | null = null;

async function load() {
  try {
    const data = await api<{ queue: QueueItem[]; professionals: typeof professionals.value }>('/admin/queue');
    queue.value = data.queue;
    professionals.value = data.professionals;
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  load();
  interval = setInterval(load, 8000);
});
onBeforeUnmount(() => { if (interval) clearInterval(interval); });

function professionalOptions(kind: QueueItem['kind']) {
  const list = kind === 'humano' ? professionals.value.humano : professionals.value.veterinario;
  return list.map(p => ({
    label: p.available_now ? p.name : `${p.name} (indisponível)`,
    value: p.id,
    disabled: !p.available_now,
  }));
}

function waiting(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  return `${minutes} min`;
}

const statusLabels: Record<QueueItem['status'], string> = {
  aguardando: 'Aguardando',
  chamado: 'Chamado',
  em_atendimento: 'Em atendimento',
};
const statusColors: Record<QueueItem['status'], 'warning' | 'info' | 'success'> = {
  aguardando: 'warning',
  chamado: 'info',
  em_atendimento: 'success',
};

async function assign(item: QueueItem) {
  const professionalId = selectedProfessional[item.id];
  if (!professionalId) {
    toast.add({ title: 'Selecione um profissional', color: 'warning' });
    return;
  }
  assigning.value = item.id;
  try {
    await api(`/admin/queue/${item.id}/assign`, { method: 'PATCH', body: { professional_id: professionalId } });
    toast.add({ title: 'Paciente direcionado', color: 'success' });
    await load();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    toast.add({ title: 'Não foi possível direcionar', description: fetchErr?.data?.error, color: 'error' });
  } finally {
    assigning.value = null;
  }
}

const sections = computed(() => [
  { kind: 'humano' as const, title: 'Humano', items: queue.value.filter(i => i.kind === 'humano') },
  { kind: 'veterinario' as const, title: 'Veterinário', items: queue.value.filter(i => i.kind === 'veterinario') },
]);
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Fila de Atendimento</h1>
      <p class="text-gray-500 text-sm mt-1">Acompanhe a fila de pronto atendimento e direcione pacientes para um profissional específico</p>
    </div>

    <div v-if="pending" class="text-center text-gray-400 py-12">Carregando...</div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="section in sections" :key="section.kind" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-800">{{ section.title }}</h2>
          <UBadge :label="String(section.items.length)" color="info" variant="soft" />
        </div>

        <div v-if="!section.items.length" class="py-8 text-center text-sm text-gray-400">Ninguém na fila.</div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="item in section.items" :key="item.id" class="p-6 flex flex-col gap-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-gray-800">{{ section.kind === 'humano' ? (item.dependent_name || item.owner_name) : item.pet_name }}</p>
                <p class="text-sm text-gray-500">{{ section.kind === 'humano' ? 'Titular: ' + item.owner_name : 'Tutor: ' + item.owner_name }} · aguardando {{ waiting(item.joined_at) }}</p>
                <p v-if="item.professional_name" class="text-sm text-gray-500 mt-0.5">Direcionado para: <span class="font-medium text-gray-700">{{ item.professional_name }}</span></p>
              </div>
              <div class="flex flex-col items-end gap-1 shrink-0">
                <UBadge :label="statusLabels[item.status]" :color="statusColors[item.status]" variant="soft" />
                <UBadge v-if="item.priority > 0" label="Prioridade" color="error" variant="soft" />
              </div>
            </div>

            <div v-if="item.triage?.symptoms?.length" class="flex flex-wrap gap-1">
              <UBadge
                v-for="symptom in item.triage.symptoms"
                :key="symptom.label"
                :label="symptom.label"
                :color="symptom.severity === 'warning' ? 'warning' : 'neutral'"
                variant="soft"
                size="sm"
              />
            </div>
            <p v-if="item.triage?.description" class="text-xs text-gray-500">{{ item.triage.description }}</p>

            <div v-if="item.status === 'aguardando'" class="flex items-center gap-2 mt-1">
              <USelect
                v-model="selectedProfessional[item.id]"
                :items="professionalOptions(item.kind)"
                placeholder="Selecionar profissional"
                class="w-full"
              />
              <UButton
                label="Direcionar"
                icon="i-heroicons-arrow-right-circle"
                :loading="assigning === item.id"
                @click="assign(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
