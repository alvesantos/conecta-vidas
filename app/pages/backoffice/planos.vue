<script setup lang="ts">
import type { Plan, Perk } from '../../interfaces/plans';

definePageMeta({ layout: 'backoffice', middleware: 'admin' });

const { listAdmin, createPlan, updatePlan } = usePlans();

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
  is_active: true,
  perks: [] as Perk[],
});

function resetForm() {
  form.title = '';
  form.color = '#014496';
  form.focus = '';
  form.focus_desc = '';
  form.price = 0;
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
  <div class="max-w-6xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Planos</h1>
        <p class="text-gray-500 text-sm mt-1">Crie e edite os planos disponíveis no sistema</p>
      </div>
      <UButton
        label="Novo plano"
        icon="i-heroicons-plus"
        color="primary"
        @click="openCreate"
      />
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Cor</th>
            <th class="px-4 py-3 font-medium">Título</th>
            <th class="px-4 py-3 font-medium">Preço</th>
            <th class="px-4 py-3 font-medium">Benefícios</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Carregando...</td>
          </tr>
          <tr v-else-if="plans.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Nenhum plano cadastrado.</td>
          </tr>
          <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <span class="inline-block size-6 rounded-full border" :style="{ backgroundColor: plan.color }" />
            </td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ plan.title }}</td>
            <td class="px-4 py-3 text-gray-600">
              {{ Number(plan.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </td>
            <td class="px-4 py-3 text-gray-500">{{ plan.perks?.length ?? 0 }} item(s)</td>
            <td class="px-4 py-3">
              <span
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ plan.is_active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-pencil-square"
                color="primary"
                @click="openEdit(plan)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UModal v-model:open="modalOpen" :ui="{ content: 'max-w-3xl' }">
      <template #content>
        <div class="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ editingId ? 'Editar plano' : 'Novo plano' }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Título">
              <UInput v-model="form.title" />
            </UFormField>
            <UFormField label="Preço (R$)">
              <UInput v-model="form.price" type="number" step="0.01" />
            </UFormField>
            <UFormField label="Cor (hex)">
              <UInput v-model="form.color" />
            </UFormField>
            <UFormField label="Foco">
              <UInput v-model="form.focus" />
            </UFormField>
          </div>

          <UFormField label="Descrição do foco">
            <UTextarea v-model="form.focus_desc" :rows="2" />
          </UFormField>

          <div class="flex items-center gap-2">
            <UCheckbox v-model="form.is_active" />
            <span class="text-sm">Plano ativo (visível ao público)</span>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Benefícios</span>
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
            <UButton variant="outline" label="Cancelar" @click="modalOpen = false" />
            <UButton color="primary" :label="editingId ? 'Salvar' : 'Criar'" :loading="saving" @click="save" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
