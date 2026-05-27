<script setup lang="ts">
import { vMaska } from 'maska/vue';

definePageMeta({ layout: 'backoffice', middleware: 'admin' });

interface VetRow {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  recipient_id: string | null;
  created_at: string;
}

const { api } = useApi();

const vets = ref<VetRow[]>([]);
const pending = ref(true);
const errorMsg = ref('');

async function loadVets() {
  pending.value = true;
  try {
    vets.value = await api<VetRow[]>('/admin/veterinarios');
  } catch {
    errorMsg.value = 'Erro ao carregar veterinários.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadVets);

const modalOpen = ref(false);
const saving = ref(false);
const formError = ref('');

const form = reactive({
  name: '',
  cnpj: '',
  email: '',
  password: '',
  password_confirm: '',
  pix_type: 'cpf',
  pix_key: '',
  bank_code: '',
  bank_name: '',
  bank_agency: '',
  bank_account_number: '',
  bank_account_digit: '',
  bank_account_type: 'corrente',
  bank_holder_type: 'individual',
  billing_cep: '',
  billing_street: '',
  billing_number: '',
  billing_complement: '',
  billing_neighborhood: '',
  billing_city: '',
  billing_state: '',
});

function resetForm() {
  form.name = '';
  form.cnpj = '';
  form.email = '';
  form.password = '';
  form.password_confirm = '';
  form.pix_type = 'cpf';
  form.pix_key = '';
  form.bank_code = '';
  form.bank_name = '';
  form.bank_agency = '';
  form.bank_account_number = '';
  form.bank_account_digit = '';
  form.bank_account_type = 'corrente';
  form.bank_holder_type = 'individual';
  form.billing_cep = '';
  form.billing_street = '';
  form.billing_number = '';
  form.billing_complement = '';
  form.billing_neighborhood = '';
  form.billing_city = '';
  form.billing_state = '';
  formError.value = '';
}

function openCreate() {
  resetForm();
  modalOpen.value = true;
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

const holderTypeOptions = [
  { label: 'Pessoa Física', value: 'individual' },
  { label: 'Pessoa Jurídica', value: 'company' },
];

const stateOptions = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
].map((s) => ({ label: s, value: s }));

const loadingCep = ref(false);

async function fetchCep() {
  const cep = form.billing_cep.replace(/\D/g, '');
  if (cep.length !== 8) return;

  loadingCep.value = true;
  try {
    const data = await $fetch<Record<string, string>>(`https://viacep.com.br/ws/${cep}/json/`);
    if (data.erro) return;
    form.billing_street = data.logradouro || '';
    form.billing_neighborhood = data.bairro || '';
    form.billing_city = data.localidade || '';
    form.billing_state = data.uf || '';
  } catch {
    // silently fail
  } finally {
    loadingCep.value = false;
  }
}

async function save() {
  formError.value = '';

  if (!form.name || !form.cnpj || !form.email || !form.password) {
    formError.value = 'Preencha todos os campos obrigatórios.';
    return;
  }
  if (form.password !== form.password_confirm) {
    formError.value = 'As senhas não coincidem.';
    return;
  }
  if (form.password.length < 6) {
    formError.value = 'A senha deve ter pelo menos 6 caracteres.';
    return;
  }

  saving.value = true;
  try {
    const { password_confirm: _, ...payload } = form;
    await api('/admin/veterinarios', {
      method: 'POST',
      body: payload,
    });
    modalOpen.value = false;
    await loadVets();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    formError.value = fetchErr?.data?.error ?? 'Erro ao criar veterinário.';
  } finally {
    saving.value = false;
  }
}

function formatCnpj(cnpj: string) {
  const c = cnpj?.replace(/\D/g, '') ?? '';
  if (c.length !== 14) return cnpj;
  return `${c.slice(0,2)}.${c.slice(2,5)}.${c.slice(5,8)}/${c.slice(8,12)}-${c.slice(12)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function statusLabel(recipientId: string | null) {
  return recipientId ? 'Ativo' : 'Pendente';
}
</script>

<template>
  <div class="max-w-7xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Veterinários</h1>
        <p class="text-gray-500 text-sm mt-1">Gerencie os veterinários cadastrados no sistema</p>
      </div>
      <UButton
        label="Adicionar Veterinário"
        icon="i-heroicons-plus"
        color="primary"
        @click="openCreate"
      />
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
            <th class="px-4 py-3 font-medium">CNPJ</th>
            <th class="px-4 py-3 font-medium">E-mail</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Data de cadastro</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending">
            <td colspan="5" class="px-4 py-8 text-center text-gray-400">Carregando...</td>
          </tr>
          <tr v-else-if="vets.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-400">Nenhum veterinário cadastrado.</td>
          </tr>
          <tr v-for="vet in vets" :key="vet.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-800">{{ vet.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatCnpj(vet.cnpj) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ vet.email }}</td>
            <td class="px-4 py-3">
              <span
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="vet.recipient_id ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ statusLabel(vet.recipient_id) }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ formatDate(vet.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Criar Veterinário -->
    <UModal v-model:open="modalOpen" :ui="{ content: 'max-w-4xl' }">
      <template #content>
        <div class="p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-800">Adicionar Veterinário</h3>

          <!-- Dados Básicos -->
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-3">Dados Básicos</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Nome / Razão Social *">
                <UInput v-model="form.name" placeholder="Nome completo ou razão social" />
              </UFormField>
              <UFormField label="CNPJ *">
                <UInput v-model="form.cnpj" v-maska="'##.###.###/####-##'" placeholder="00.000.000/0000-00" />
              </UFormField>
              <UFormField label="E-mail *">
                <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" />
              </UFormField>
            </div>
          </div>

          <!-- Chave Pix -->
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-3">Chave Pix</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Tipo de chave">
                <USelect v-model="form.pix_type" :items="pixTypeOptions" />
              </UFormField>
              <UFormField label="Valor da chave">
                <UInput v-model="form.pix_key" placeholder="Informe a chave Pix" />
              </UFormField>
            </div>
          </div>

          <!-- Dados Bancários -->
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-3">Dados Bancários</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField label="Código do banco">
                <UInput v-model="form.bank_code" placeholder="001" />
              </UFormField>
              <UFormField label="Nome do banco" class="md:col-span-2">
                <UInput v-model="form.bank_name" placeholder="Banco do Brasil" />
              </UFormField>
              <UFormField label="Agência">
                <UInput v-model="form.bank_agency" placeholder="0001" />
              </UFormField>
              <UFormField label="Número da conta">
                <UInput v-model="form.bank_account_number" placeholder="12345" />
              </UFormField>
              <UFormField label="Dígito">
                <UInput v-model="form.bank_account_digit" placeholder="0" />
              </UFormField>
              <UFormField label="Tipo de conta">
                <USelect v-model="form.bank_account_type" :items="accountTypeOptions" />
              </UFormField>
              <UFormField label="Tipo de titular">
                <USelect v-model="form.bank_holder_type" :items="holderTypeOptions" />
              </UFormField>
            </div>
          </div>

          <!-- Endereço de Faturamento -->
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-3">Endereço de Faturamento</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField label="CEP">
                <UInput
                  v-model="form.billing_cep"
                  v-maska="'#####-###'"
                  placeholder="00000-000"
                  :loading="loadingCep"
                  @blur="fetchCep"
                />
              </UFormField>
              <UFormField label="Logradouro" class="md:col-span-2">
                <UInput v-model="form.billing_street" placeholder="Rua, Avenida..." />
              </UFormField>
              <UFormField label="Número">
                <UInput v-model="form.billing_number" placeholder="123" />
              </UFormField>
              <UFormField label="Complemento">
                <UInput v-model="form.billing_complement" placeholder="Sala, Andar..." />
              </UFormField>
              <UFormField label="Bairro">
                <UInput v-model="form.billing_neighborhood" placeholder="Centro" />
              </UFormField>
              <UFormField label="Cidade">
                <UInput v-model="form.billing_city" placeholder="São Paulo" />
              </UFormField>
              <UFormField label="Estado">
                <USelect v-model="form.billing_state" :items="stateOptions" placeholder="UF" />
              </UFormField>
            </div>
          </div>

          <!-- Senha -->
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-3">Senha de Acesso</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Senha *">
                <UInput v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" />
              </UFormField>
              <UFormField label="Confirmar Senha *">
                <UInput v-model="form.password_confirm" type="password" placeholder="Repita a senha" />
              </UFormField>
            </div>
          </div>

          <UAlert v-if="formError" color="error" variant="soft" :description="formError" />

          <div class="flex justify-end gap-2 mt-2">
            <UButton variant="outline" label="Cancelar" @click="modalOpen = false" />
            <UButton color="primary" label="Criar Veterinário" :loading="saving" @click="save" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
