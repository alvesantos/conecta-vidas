<script setup lang="ts">
import type { Plan } from '../../interfaces/plans';

definePageMeta({ layout: 'backoffice', middleware: 'admin' });

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  address: string | null;
  type: 'tutor' | 'admin';
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
    users.value = await api<AdminUserRow[]>('/admin/users');
  } catch {
    errorMsg.value = 'Erro ao carregar usuários.';
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
const editForm = reactive({ name: '', email: '', type: 'tutor' as 'tutor' | 'admin', address: '' });
const editSaving = ref(false);
const editError = ref('');

function openEdit(row: AdminUserRow) {
  editTarget.value = row;
  editForm.name = row.name;
  editForm.email = row.email;
  editForm.type = row.type;
  editForm.address = row.address ?? '';
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
      },
    });
    editOpen.value = false;
    await loadUsers();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    editError.value = fetchErr?.data?.error ?? 'Erro ao salvar.';
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
  } finally {
    deleteLoading.value = false;
  }
}

// --- Modal de mudança de plano ---
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
      body: { plan_id: plan.id, paid_value: 0 },
    });
    planOpen.value = false;
    await loadUsers();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    planError.value = fetchErr?.data?.error ?? 'Erro ao mudar plano.';
  } finally {
    planSaving.value = false;
  }
}

async function clearPlan() {
  if (!planTarget.value) return;
  planSaving.value = true;
  planError.value = '';
  try {
    await api(`/admin/users/${planTarget.value.id}/subscription`, { method: 'DELETE' });
    planOpen.value = false;
    await loadUsers();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    planError.value = fetchErr?.data?.error ?? 'Erro ao remover plano.';
  } finally {
    planSaving.value = false;
  }
}

function typeLabel(type: 'tutor' | 'admin') {
  return type === 'admin' ? 'Administrador' : 'Tutor';
}
</script>

<template>
  <div class="max-w-7xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Usuários</h1>
        <p class="text-gray-500 text-sm mt-1">Lista completa de tutores e administradores</p>
      </div>
    </div>

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :description="errorMsg"
      class="mb-4"
    />

    <div class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Nome</th>
            <th class="px-4 py-3 font-medium">E-mail</th>
            <th class="px-4 py-3 font-medium">Tipo</th>
            <th class="px-4 py-3 font-medium">Plano</th>
            <th class="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending">
            <td colspan="5" class="px-4 py-8 text-center text-gray-400">Carregando...</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-400">Nenhum usuário encontrado.</td>
          </tr>
          <tr v-for="row in users" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-800">
              {{ row.name }}
              <span v-if="me?.id === row.id" class="text-xs text-accent ml-1">(você)</span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ row.email }}</td>
            <td class="px-4 py-3">
              <span
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="row.type === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ typeLabel(row.type) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button
                class="text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition-colors"
                :class="row.plan_title ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="openPlanModal(row)"
              >
                {{ row.plan_title || 'Free' }}
              </button>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-2">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-pencil-square"
                  color="primary"
                  @click="openEdit(row)"
                />
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  color="error"
                  :disabled="me?.id === row.id"
                  @click="openDelete(row)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
                { label: 'Tutor', value: 'tutor' },
                { label: 'Administrador', value: 'admin' },
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
