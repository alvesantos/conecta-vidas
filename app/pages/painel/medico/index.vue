<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' });

const { user } = useAuth();

// Dados simulados para o layout básico inicial
const stats = {
  today: 4,
  week: 18,
  totalClients: 142,
  pendingRecords: 2
};

const recentConsultations = [
  { id: 1, patient: 'Maria Silva', time: '09:00', type: 'Rotina', status: 'Concluído' },
  { id: 2, patient: 'João Pedro', time: '10:30', type: 'Retorno', status: 'Concluído' },
  { id: 3, patient: 'Ana Carolina', time: '14:00', type: 'Emergência', status: 'Em andamento' },
  { id: 4, patient: 'Carlos Eduardo', time: '16:00', type: 'Rotina', status: 'Agendado' },
];
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Olá, Dr(a). {{ user?.name?.split(' ')[0] || 'Médico' }}!</h1>
      <p class="text-gray-500 text-sm mt-1">Aqui está o resumo dos seus atendimentos de hoje.</p>
    </div>

    <!-- Cards de Métricas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div class="size-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-chart-bar" class="size-6 text-purple-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Na Semana</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.week }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="size-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-clipboard-document-list" class="size-6 text-orange-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Prontuários Pendentes</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.pendingRecords }}</p>
        </div>
      </div>
    </div>

    <!-- Tabela de Últimos Atendimentos -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
