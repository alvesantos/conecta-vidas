<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  type: 'tutor' | 'admin' | 'veterinario' | 'medico';
  status?: 'pending' | 'active' | 'rejected' | 'suspended';
  created_at: string;
}

const { api } = useApi();
const users = ref<AdminUserRow[]>([]);
const pending = ref(true);
const errorMsg = ref('');

const pendingProfessionals = computed(() => {
  return users.value.filter(u => u.status === 'pending' && (u.type === 'medico' || u.type === 'veterinario'));
});

async function loadUsers() {
  pending.value = true;
  try {
    users.value = await api<AdminUserRow[]>('/admin/users');
  } catch {
    errorMsg.value = 'Erro ao carregar lista de aprovações.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadUsers);

const columns = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'created_at', header: 'Data do Cadastro' },
  { id: 'actions', header: 'Ação' },
];

function typeLabel(type: string) {
  if (type === 'medico') return 'Médico';
  if (type === 'veterinario') return 'Veterinário';
  return type;
}

const isUpdating = ref(false);

async function setStatus(id: string, status: 'active' | 'rejected') {
  if (isUpdating.value) return;
  isUpdating.value = true;
  try {
    await api(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: { status }
    });
    useToast().add({
      title: 'Sucesso',
      description: status === 'active' ? 'Profissional aprovado!' : 'Profissional rejeitado!',
      color: status === 'active' ? 'green' : 'red',
    });
    await loadUsers();
  } catch {
    useToast().add({
      title: 'Erro',
      description: 'Não foi possível atualizar o status.',
      color: 'red',
    });
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Aprovações</h1>
        <p class="text-gray-500 text-sm mt-1">Aprove ou rejeite o cadastro de novos médicos e veterinários.</p>
      </div>
    </div>

    <UAlert v-if="errorMsg" :title="errorMsg" color="red" class="mb-4" />

    <UCard>
      <UTable
        :data="pendingProfessionals"
        :columns="columns"
        :loading="pending"
        class="w-full"
      >
        <template #empty-state>
          <div class="text-center py-8 text-gray-500">
            Nenhum profissional aguardando aprovação.
          </div>
        </template>
        <template #type-cell="{ row }">
          <UBadge
            :label="typeLabel(row.original.type)"
            :color="row.original.type === 'medico' ? 'warning' : 'success'"
            variant="subtle"
          />
        </template>
        <template #created_at-cell="{ row }">
          {{ new Date(row.original.created_at).toLocaleDateString('pt-BR') }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-3">
            <UButton
              size="md"
              color="green"
              variant="solid"
              icon="i-heroicons-check"
              class="rounded-full px-4 font-semibold shadow-sm transition-transform hover:scale-105 bg-green-500 hover:bg-green-600 text-white"
              @click="setStatus(row.original.id, 'active')"
            >
              Aprovar
            </UButton>
            <UButton
              size="md"
              color="red"
              variant="solid"
              icon="i-heroicons-x-mark"
              :loading="isUpdating"
              @click="setStatus(row.original.id, 'rejected')"
              Reprovar
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
