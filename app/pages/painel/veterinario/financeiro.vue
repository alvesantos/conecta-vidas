<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' });

interface FinanceiroProfile {
  pix_type: string | null;
  pix_key: string | null;
  bank_code: string | null;
  bank_name: string | null;
  bank_agency: string | null;
  bank_account_number: string | null;
  bank_account_digit: string | null;
  bank_account_type: string | null;
}

const { api } = useApi();

const pending = ref(true);
const loadError = ref('');

const form = reactive<FinanceiroProfile>({
  pix_type: null,
  pix_key: null,
  bank_code: null,
  bank_name: null,
  bank_agency: null,
  bank_account_number: null,
  bank_account_digit: null,
  bank_account_type: null,
});

async function loadProfile() {
  pending.value = true;
  loadError.value = '';
  try {
    const profile = await api<FinanceiroProfile>('/vet/profile');
    Object.assign(form, profile);
  } catch {
    loadError.value = 'Erro ao carregar dados financeiros.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadProfile);

const saving = ref(false);
const saveError = ref('');
const saveSuccess = ref('');

async function save() {
  saveError.value = '';
  saveSuccess.value = '';
  saving.value = true;
  try {
    await api('/vet/financeiro', { method: 'PUT', body: form });
    saveSuccess.value = 'Dados financeiros atualizados com sucesso!';
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    saveError.value = fetchErr?.data?.error ?? 'Erro ao salvar dados financeiros.';
  } finally {
    saving.value = false;
  }
}

const pixTypeOptions = [
  { label: 'CPF', value: 'cpf' },
  { label: 'CNPJ', value: 'cnpj' },
  { label: 'E-mail', value: 'email' },
  { label: 'Telefone', value: 'telefone' },
  { label: 'Aleatória', value: 'aleatoria' },
];

const accountTypeOptions = [
  { label: 'Conta Corrente', value: 'corrente' },
  { label: 'Conta Poupança', value: 'poupanca' },
];
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Financeiro</h1>
      <p class="text-gray-500 text-sm mt-1">Seus dados financeiros e valor a receber</p>
    </div>

    <UAlert v-if="loadError" color="error" variant="soft" :description="loadError" class="mb-4" />

    <div v-if="pending" class="text-center text-gray-400 py-12">Carregando...</div>

    <template v-else>
      <!-- Valor a Receber -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-sm text-gray-500 mb-1">Valor a receber</p>
          <p class="text-2xl font-bold text-yellow-600">R$ 0,00</p>
          <p class="text-xs text-gray-400 mt-1">Disponível após a integração com o Asaas.</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Saques</p>
            <p class="text-xs text-gray-400">Solicite o repasse do seu saldo disponível.</p>
          </div>
          <div class="mt-4">
            <UButton variant="soft" color="primary" label="Solicitar Saque" icon="i-heroicons-arrow-up-tray" disabled />
          </div>
        </div>
      </div>

      <!-- Dados financeiros -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-1">Dados Financeiros</h2>
        <p class="text-sm text-gray-500 mb-4">Chave Pix e dados bancários usados para receber seus repasses.</p>

        <h3 class="text-sm font-semibold text-gray-700 mb-3">Chave Pix</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <UFormField label="Tipo de chave">
            <USelect v-model="form.pix_type" :items="pixTypeOptions" placeholder="Selecione" class="w-full" />
          </UFormField>
          <UFormField label="Chave Pix">
            <UInput v-model="form.pix_key" placeholder="Sua chave Pix" class="w-full" />
          </UFormField>
        </div>

        <h3 class="text-sm font-semibold text-gray-700 mb-3">Dados Bancários</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormField label="Banco">
            <UInput v-model="form.bank_name" placeholder="Nome do banco" class="w-full" />
          </UFormField>
          <UFormField label="Agência">
            <UInput v-model="form.bank_agency" placeholder="0000" class="w-full" />
          </UFormField>
          <UFormField label="Conta">
            <UInput v-model="form.bank_account_number" placeholder="00000" class="w-full" />
          </UFormField>
          <UFormField label="Dígito">
            <UInput v-model="form.bank_account_digit" placeholder="0" class="w-full" />
          </UFormField>
          <UFormField label="Tipo de conta">
            <USelect v-model="form.bank_account_type" :items="accountTypeOptions" placeholder="Selecione" class="w-full" />
          </UFormField>
        </div>

        <UAlert v-if="saveError" color="error" variant="soft" :description="saveError" class="mt-4" />
        <UAlert v-if="saveSuccess" color="success" variant="soft" :description="saveSuccess" class="mt-4" />

        <div class="flex justify-end mt-4">
          <UButton color="primary" label="Salvar" :loading="saving" @click="save" />
        </div>
      </div>
    </template>
  </div>
</template>
