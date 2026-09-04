<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' });

const { user } = useAuth();


const { api } = useApi();
const stats = ref({ today: 0, totalClients: 0, pendingConsultations: 0 });
const recentConsultations = ref<any[]>([]);
const pending = ref(true);

onMounted(async () => {
  try {
    const data = await api<any>('/medico/dashboard');
    stats.value = data.stats;
    recentConsultations.value = data.recentConsultations;
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
  } finally {
    pending.value = false;
  }
});

</script>

<template>
  <div>
    <div v-if="pending" class="py-12 flex justify-center"><UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-gray-400" /></div>
    <div v-else class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Olá, Dr(a). {{ user?.name?.split(' ')[0] || 'Médico' }}!</h1>
      <p class="text-gray-500 text-sm mt-1">Aqui está o resumo dos seus atendimentos.</p>
    </div>

    <!-- Cards de Métricas -->
    <div v-if="!pending" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="size-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-calendar-days" class="size-6 text-green-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Atendimentos Hoje</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.today }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="size-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-users" class="size-6 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Pacientes Atendidos</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.totalClients }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="size-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-clipboard-document-list" class="size-6 text-orange-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Atendimentos Pendentes</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.pendingConsultations }}</p>
        </div>
      </div>
    </div>

    <!-- Tabela de Últimos Atendimentos -->
    <div v-if="!pending" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-800">Últimos Atendimentos de Hoje</h2>
        <UButton variant="ghost" color="gray" size="sm" to="/painel/medico/consultas">Ver todos</UButton>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-500 text-sm">
              <th class="py-3 px-6 font-medium">Horário</th>
              <th class="py-3 px-6 font-medium">Paciente</th>
              <th class="py-3 px-6 font-medium">Tipo</th>
              <th class="py-3 px-6 font-medium">Status</th>
              <th class="py-3 px-6 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in recentConsultations" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 px-6 text-sm text-gray-600 font-medium">{{ item.time }}</td>
              <td class="py-4 px-6 text-sm font-semibold text-gray-800">{{ item.patient }}</td>
              <td class="py-4 px-6 text-sm text-gray-600">{{ item.type }}</td>
              <td class="py-4 px-6 text-sm">
                <UBadge 
                  :color="item.status === 'Concluído' ? 'green' : item.status === 'Em andamento' ? 'amber' : 'gray'" 
                  variant="subtle"
                >
                  {{ item.status }}
                </UBadge>
              </td>
              <td class="py-4 px-6 text-right">
                <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-eye">Abrir</UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
