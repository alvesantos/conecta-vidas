<script setup lang="ts">
import type { Plan } from '../../interfaces/plans';

definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  address: string | null;
  type: 'tutor' | 'admin' | 'veterinario' | 'medico';
  status?: 'pending' | 'active' | 'rejected' | 'suspended';
  created_at: string;
  subscription_id: string | null;
  plan_id: string | null;
  paid_value: string | number | null;
  plan_title: string | null;
  plan_price: string | number | null;
  plan_color: string | null;
}

const { api } = useApi();
const { user: me } = useAuth();

const users = ref<AdminUserRow[]>([]);
const plans = ref<Plan[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadUsers() {
  pending.value = true;
  try {
    const data = await api<AdminUserRow[]>('/admin/users');
    users.value = data.filter(u => u.type === 'medico' && u.status !== 'pending');
  } catch {
    errorMsg.value = 'Erro ao carregar médicos.';
  } finally {
    pending.value = false;
  }
}

async function loadPlans() {
  try {
    plans.value = await api<Plan[]>('/admin/plans');
  } catch {
    plans.value = [];
  }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadPlans()]);
});

// --- Editar usuário ---
const editOpen = ref(false);
const editTarget = ref<AdminUserRow | null>(null);
const editForm = reactive({ 
  name: '', 
  email: '', 
  type: 'medico' as AdminUserRow['type'], 
  address: '',
  status: 'active' as AdminUserRow['status'] 
});
const editSaving = ref(false);
const editError = ref('');

function openEdit(row: AdminUserRow) {
  editTarget.value = row;
  editForm.name = row.name;
  editForm.email = row.email;
  editForm.type = row.type;
  editForm.address = row.address ?? '';
  editForm.status = row.status ?? 'active';
  editError.value = '';
  editOpen.value = true;
}

async function saveEdit() {
  if (!editTarget.value) return;
  editSaving.value = true;
  editError.value = '';
  try {
    await api(`/admin/users/${editTarget.value.id}`, {
      method: 'PUT',
      body: {
        name: editForm.name,
        email: editForm.email,
        type: editForm.type,
        address: editForm.address || null,
        status: editForm.status,
      },
    });
    editOpen.value = false;
    await loadUsers();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    editError.value = fetchErr?.data?.error ?? 'Erro ao salvar alterações.';
  } finally {
    editSaving.value = false;
  }
}

// --- Excluir usuário ---
const deleteOpen = ref(false);
const deleteTarget = ref<AdminUserRow | null>(null);
const deleteLoading = ref(false);

function openDelete(row: AdminUserRow) {
  deleteTarget.value = row;
  deleteOpen.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    await api(`/admin/users/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteOpen.value = false;
    await loadUsers();
  } catch {
    useToast().add({ title: 'Erro', description: 'Não foi possível excluir.', color: 'error' });
  } finally {
    deleteLoading.value = false;
  }
}

// --- Planos ---
const planOpen = ref(false);
const planTarget = ref<AdminUserRow | null>(null);
const planSaving = ref(false);
const planError = ref('');

function openPlanModal(row: AdminUserRow) {
  planTarget.value = row;
  planError.value = '';
  planOpen.value = true;
}

async function assignPlan(plan: Plan) {
  if (!planTarget.value) return;
  planSaving.value = true;
  planError.value = '';
  try {
    await api(`/admin/users/${planTarget.value.id}/subscription`, {
      method: 'POST',
      body: { plan_id: plan.id },
    });
    planOpen.value = false;
    await loadUsers();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    planError.value = fetchErr?.data?.error ?? 'Erro ao atribuir plano.';
  } finally {
    planSaving.value = false;
  }
}

async function clearPlan() {
  if (!planTarget.value) return;
  planSaving.value = true;
  planError.value = '';
  try {
    await api(`/admin/users/${planTarget.value.id}/subscription`, {
      method: 'DELETE',
    });
    planOpen.value = false;
    await loadUsers();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    planError.value = fetchErr?.data?.error ?? 'Erro ao remover plano.';
  } finally {
    planSaving.value = false;
  }
}

function typeLabel(type: AdminUserRow['type']) {
  if (type === 'admin') return 'Administrador';
  if (type === 'medico') return 'Médico';
  if (type === 'veterinario') return 'Veterinário';
  return 'Cliente';
}

const columns = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'plan_title', header: 'Plano' },
  { id: 'actions', header: '' },
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Médicos</h1>
        <p class="text-gray-500 text-sm mt-1">Lista completa de médicos cadastrados na plataforma</p>
      </div>
    </div>

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :description="errorMsg"
      class="mb-4"
    />

    <div class="bg-white rounded-xl shadow">
      <UTable
        :data="users"
        :columns="columns"
        :loading="pending"
        class="w-full"
      >
        <template #name-cell="{ row }">
          <span class="font-medium text-gray-800">
            {{ row.original.name }}
            <span v-if="me?.id === row.original.id" class="text-xs text-accent ml-1">(você)</span>
          </span>
        </template>

        <template #type-cell="{ row }">
          <UBadge
            :label="typeLabel(row.original.type)"
            :color="row.original.type === 'admin' ? 'purple' : row.original.type === 'medico' ? 'warning' : row.original.type === 'veterinario' ? 'success' : 'info'"
            variant="subtle"
          />
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :label="row.original.status === 'pending' ? 'Pendente' : row.original.status === 'rejected' ? 'Rejeitado' : row.original.status === 'suspended' ? 'Suspenso' : 'Ativo'"
            :color="row.original.status === 'pending' ? 'warning' : row.original.status === 'active' || !row.original.status ? 'success' : 'error'"
            variant="subtle"
          />
        </template>

        <template #plan_title-cell="{ row }">
          <UBadge
            :label="row.original.plan_title || 'Free'"
            :color="row.original.plan_title ? 'success' : 'neutral'"
            variant="subtle"
            class="cursor-pointer"
            @click="openPlanModal(row.original)"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UDropdownMenu
              :items="[
                [
                  { label: 'Editar', icon: 'i-heroicons-pencil-square', onSelect: () => openEdit(row.original) },
                  { label: 'Excluir', icon: 'i-heroicons-trash', color: 'error', disabled: me?.id === row.original.id, onSelect: () => openDelete(row.original) },
                ],
              ]"
            >
              <UButton size="md" variant="ghost" icon="i-heroicons-ellipsis-vertical" color="neutral" />
            </UDropdownMenu>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400">
            <UIcon name="i-heroicons-users" class="size-10 mb-2" />
            <p class="text-sm">Nenhum usuário encontrado.</p>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Modal Editar -->
    <UModal v-model:open="editOpen">
      <template #content>
        <div class="p-6 flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-800">Editar usuário</h3>

          <UFormField label="Nome">
            <UInput v-model="editForm.name" />
          </UFormField>
          <UFormField label="E-mail">
            <UInput v-model="editForm.email" type="email" />
          </UFormField>
          <UFormField label="Endereço">
            <UInput v-model="editForm.address" />
          </UFormField>
          <UFormField label="Tipo">
            <USelect
              v-model="editForm.type"
              :items="[
                { label: 'Cliente', value: 'tutor' },
                { label: 'Médico', value: 'medico' },
                { label: 'Veterinário', value: 'veterinario' },
                { label: 'Administrador', value: 'admin' },
              ]"
            />
          </UFormField>
          <UFormField label="Status">
            <USelect
              v-model="editForm.status"
              :items="[
                { label: 'Ativo', value: 'active' },
                { label: 'Pendente', value: 'pending' },
                { label: 'Inativo (Suspenso)', value: 'suspended' },
                { label: 'Rejeitado', value: 'rejected' }
              ]"
            />
          </UFormField>

          <UAlert v-if="editError" color="error" variant="soft" :description="editError" />

          <div class="flex justify-end gap-2 mt-2">
            <UButton variant="outline" label="Cancelar" @click="editOpen = false" />
            <UButton color="primary" label="Salvar" :loading="editSaving" @click="saveEdit" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Modal Excluir -->
    <UModal v-model:open="deleteOpen">
      <template #content>
        <div class="p-6 flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-800">Excluir usuário</h3>
          <p class="text-sm text-gray-600">
            Esta ação é <strong>permanente</strong> e excluirá também todos os pets e assinaturas
            de <strong>{{ deleteTarget?.name }}</strong>. Deseja continuar?
          </p>
          <div class="flex justify-end gap-2 mt-2">
            <UButton variant="outline" label="Cancelar" @click="deleteOpen = false" />
            <UButton color="error" label="Excluir" :loading="deleteLoading" @click="confirmDelete" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Modal Plano -->
    <UModal v-model:open="planOpen">
      <template #content>
        <div class="p-6 flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-800">
            Plano de {{ planTarget?.name }}
          </h3>
          <p v-if="planTarget?.plan_title" class="text-sm text-gray-600">
            Plano atual: <strong>{{ planTarget.plan_title }}</strong>
          </p>
          <p v-else class="text-sm text-gray-600">
            Este usuário está no plano <strong>Free</strong>.
          </p>

          <UAlert v-if="planError" color="error" variant="soft" :description="planError" />

          <div class="flex flex-col gap-2">
            <button
              v-for="plan in plans"
              :key="plan.id"
              class="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              :class="planTarget?.plan_id === plan.id ? 'border-accent bg-accent/5' : 'border-gray-200'"
              :disabled="planSaving"
              @click="assignPlan(plan)"
            >
              <div>
                <p class="font-medium text-gray-800">{{ plan.title }}</p>
                <p class="text-xs text-gray-500">
                  {{ Number(plan.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }} / mês
                </p>
              </div>
              <UIcon
                v-if="planTarget?.plan_id === plan.id"
                name="i-heroicons-check-circle"
                class="size-6 text-accent"
              />
            </button>
          </div>

          <div class="flex justify-between gap-2 mt-2">
            <UButton
              variant="ghost"
              color="error"
              label="Remover plano (Free)"
              :disabled="!planTarget?.plan_id || planSaving"
              @click="clearPlan"
            />
            <UButton variant="outline" label="Fechar" @click="planOpen = false" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
