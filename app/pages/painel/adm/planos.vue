<script setup lang="ts">
import type { Plan, Perk } from '../../interfaces/plans';

definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

const { listAdmin, createPlan, updatePlan, deletePlan } = usePlans();

const plans = ref<Plan[]>([]); 
const pending = ref(true);

async function loadPlans() {
  pending.value = true;
  try {
    plans.value = await listAdmin();
  } finally {
    pending.value = false;
  }
}

onMounted(loadPlans);

// --- Form modal ---
const modalOpen = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const formError = ref('');
const form = reactive({
  title: '',
  color: '#014496',
  focus: '',
  focus_desc: '',
  price: 0,
  free_consultations: 0,
  is_active: true,
  perks: [] as Perk[],
});

function resetForm() {
  form.title = '';
  form.color = '#014496';
  form.focus = '';
  form.focus_desc = '';
  form.price = 0;
  form.free_consultations = 0;
  form.is_active = true;
  form.perks = [{ icon: 'i-ph-check', label: '' }];
  formError.value = '';
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function openEdit(plan: Plan) {
  editingId.value = String(plan.id);
  form.title = plan.title;
  form.color = plan.color;
  form.focus = plan.focus;
  form.focus_desc = plan.focus_desc;
  form.price = Number(plan.price);
  form.free_consultations = Number(plan.free_consultations ?? 0);
  form.is_active = plan.is_active ?? true;
  form.perks = Array.isArray(plan.perks)
    ? plan.perks.map((p) => ({ ...p }))
    : [{ icon: 'i-ph-check', label: '' }];
  formError.value = '';
  modalOpen.value = true;
}

function addPerk() {
  form.perks.push({ icon: 'i-ph-check', label: '' });
}

function removePerk(index: number) {
  form.perks.splice(index, 1);
}

const columns = [
  { id: 'color', header: 'Cor' },
  { accessorKey: 'title', header: 'Título' },
  { accessorKey: 'price', header: 'Preço' },
  { accessorKey: 'free_consultations', header: 'Consultas grátis' },
  { id: 'perks_count', header: 'Benefícios' },
  { accessorKey: 'is_active', header: 'Status' },
  { id: 'actions', header: '' },
];

// --- Excluir plano ---
const deleteOpen = ref(false);
const deleteTarget = ref<Plan | null>(null);
const deleteLoading = ref(false);
const deleteError = ref('');

function openDeletePlan(plan: Plan) {
  deleteTarget.value = plan;
  deleteError.value = '';
  deleteOpen.value = true;
}

async function confirmDeletePlan() {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  deleteError.value = '';
  try {
    await deletePlan(String(deleteTarget.value.id));
    deleteOpen.value = false;
    await loadPlans();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    deleteError.value = fetchErr?.data?.error ?? 'Erro ao excluir plano.';
  } finally {
    deleteLoading.value = false;
  }
}

async function save() {
  saving.value = true;
  formError.value = '';
  try {
    const payload = {
      title: form.title,
      color: form.color,
      focus: form.focus,
      focus_desc: form.focus_desc,
      price: Number(form.price),
      free_consultations: Number(form.free_consultations),
      is_active: form.is_active,
      perks: form.perks.filter((p) => p.label.trim()),
    };
    if (editingId.value) {
      await updatePlan(editingId.value, payload);
    } else {
      await createPlan(payload);
    }
    modalOpen.value = false;
    await loadPlans();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    formError.value = fetchErr?.data?.error ?? 'Erro ao salvar plano.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Planos</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Crie e edite os planos disponíveis no sistema</p>
      </div>
      <UButton
        label="Novo plano"
        icon="i-heroicons-plus"
        color="primary"
        class="dark:text-white"
        @click="openCreate"
      />
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <UTable
        :data="plans"
        :columns="columns"
        :loading="pending"
        class="w-full"
      >
        <template #color-cell="{ row }">
          <span class="inline-block size-6 rounded-full border" :style="{ backgroundColor: row.original.color }" />
        </template>

        <template #title-cell="{ row }">
          <span class="font-medium text-gray-800 dark:text-gray-100">{{ row.original.title }}</span>
        </template>

        <template #price-cell="{ row }">
          {{ Number(row.original.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
        </template>

        <template #free_consultations-cell="{ row }">
          {{ row.original.free_consultations ?? 0 }} / mês
        </template>

        <template #perks_count-cell="{ row }">
          {{ row.original.perks?.length ?? 0 }} item(s)
        </template>

        <template #is_active-cell="{ row }">
          <UBadge
            :label="row.original.is_active ? 'Ativo' : 'Inativo'"
            :color="row.original.is_active ? 'success' : 'neutral'"
            variant="subtle"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UDropdownMenu
              :items="[
                [
                  { label: 'Editar', icon: 'i-heroicons-pencil-square', onSelect: () => openEdit(row.original) },
                  { label: 'Excluir', icon: 'i-heroicons-trash', color: 'error', onSelect: () => openDeletePlan(row.original) },
                ],
              ]"
            >
              <UButton size="md" variant="ghost" icon="i-heroicons-ellipsis-vertical" color="neutral" />
            </UDropdownMenu>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <UIcon name="i-heroicons-credit-card" class="size-10 mb-2" />
            <p class="text-sm">Nenhum plano cadastrado.</p>
          </div>
        </template>
      </UTable>
    </div>

    <UModal v-model:open="modalOpen" :ui="{ content: 'w-full max-w-full md:w-[70vw] md:max-w-[70vw]' }">
      <template #content>
        <div class="flex flex-col max-h-[90vh] dark:bg-gray-800">
          <div class="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {{ editingId ? 'Editar plano' : 'Novo plano' }}
            </h3>
            <UButton icon="i-heroicons-x-mark" variant="ghost" color="neutral" size="md" @click="modalOpen = false" />
          </div>
          <div class="px-8 py-6 flex flex-col gap-4 overflow-y-auto flex-1">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Título" class="w-full">
              <UInput v-model="form.title" class="w-full" />
            </UFormField>
            <UFormField label="Preço (R$)" class="w-full">
              <UInput v-model="form.price" type="number" step="0.01" class="w-full" />
            </UFormField>
            <UFormField label="Consultas grátis / mês" class="w-full">
              <UInput v-model="form.free_consultations" type="number" min="0" step="1" class="w-full" />
            </UFormField>
            <UFormField label="Cor (hex)" class="w-full">
              <UInput v-model="form.color" class="w-full" />
            </UFormField>
            <UFormField label="Foco" class="w-full">
              <UInput v-model="form.focus" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Descrição do foco" class="w-full">
            <UTextarea v-model="form.focus_desc" :rows="2" class="w-full" />
          </UFormField>

          <div class="flex items-center gap-2">
            <UCheckbox v-model="form.is_active" />
            <span class="text-sm">Plano ativo (visível ao público)</span>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Benefícios</span>
              <UButton size="xs" variant="ghost" icon="i-heroicons-plus" label="Adicionar" @click="addPerk" />
            </div>
            <div class="flex flex-col gap-2">
              <div
                v-for="(perk, index) in form.perks"
                :key="index"
                class="flex items-center gap-2"
              >
                <UInput v-model="perk.icon" placeholder="Ícone (i-ph-check)" class="w-48" />
                <UInput v-model="perk.label" placeholder="Descrição do benefício" class="flex-1" />
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  color="error"
                  @click="removePerk(index)"
                />
              </div>
            </div>
          </div>

          <UAlert v-if="formError" color="error" variant="soft" :description="formError" />

          <div class="flex justify-end gap-2 mt-2">
            <UButton variant="outline" label="Cancelar" class="dark:text-white" @click="modalOpen = false" />
            <UButton color="primary" :label="editingId ? 'Salvar' : 'Criar'" :loading="saving" class="dark:text-white" @click="save" />
          </div>
          </div>
        </div>
      </template>
    </UModal>
    <!-- Modal Excluir Plano -->
    <UModal v-model:open="deleteOpen">
      <template #content>
        <div class="p-6 flex flex-col gap-4 dark:bg-gray-800">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Excluir plano</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Tem certeza que deseja excluir o plano <strong>{{ deleteTarget?.title }}</strong>?
            Esta ação é permanente.
          </p>
          <UAlert v-if="deleteError" color="error" variant="soft" :description="deleteError" />
          <div class="flex justify-end gap-2 mt-2">
            <UButton variant="outline" label="Cancelar" @click="deleteOpen = false" />
            <UButton color="error" label="Excluir" :loading="deleteLoading" @click="confirmDeletePlan" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
