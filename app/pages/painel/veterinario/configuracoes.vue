<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' });

interface VetProfile {
  id: string;
  name: string;
  cnpj: string;
  email: string;
}

const { api } = useApi();

const profile = ref<VetProfile | null>(null);
const pending = ref(true);
const errorMsg = ref('');

async function loadProfile() {
  pending.value = true;
  try {
    profile.value = await api<VetProfile>('/vet/profile');
  } catch {
    errorMsg.value = 'Erro ao carregar perfil.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadProfile);

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
});
const passwordSaving = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

async function changePassword() {
  passwordError.value = '';
  passwordSuccess.value = '';

  if (!passwordForm.current_password || !passwordForm.new_password) {
    passwordError.value = 'Preencha todos os campos.';
    return;
  }
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordError.value = 'As senhas não coincidem.';
    return;
  }
  if (passwordForm.new_password.length < 6) {
    passwordError.value = 'A nova senha deve ter pelo menos 6 caracteres.';
    return;
  }

  passwordSaving.value = true;
  try {
    await api('/vet/password', {
      method: 'PUT',
      body: {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      },
    });
    passwordSuccess.value = 'Senha alterada com sucesso!';
    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.confirm_password = '';
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    passwordError.value = fetchErr?.data?.error ?? 'Erro ao alterar senha.';
  } finally {
    passwordSaving.value = false;
  }
}

function formatCnpj(cnpj: string) {
  const c = cnpj?.replace(/\D/g, '') ?? '';
  if (c.length !== 14) return cnpj;
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Configurações</h1>
      <p class="text-gray-500 text-sm mt-1">Seus dados cadastrais e senha</p>
    </div>

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :description="errorMsg"
      class="mb-4"
    />

    <div v-if="pending" class="text-center text-gray-400 py-12">Carregando...</div>

    <template v-else-if="profile">
      <!-- Dados cadastrais -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Dados Cadastrais</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide">Nome / Razão Social</p>
            <p class="text-gray-800 font-medium">{{ profile.name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide">CNPJ</p>
            <p class="text-gray-800 font-medium">{{ formatCnpj(profile.cnpj) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide">E-mail</p>
            <p class="text-gray-800 font-medium">{{ profile.email }}</p>
          </div>
        </div>
      </div>

      <!-- Alterar senha -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Alterar Senha</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormField label="Senha atual">
            <UInput v-model="passwordForm.current_password" type="password" />
          </UFormField>
          <UFormField label="Nova senha">
            <UInput v-model="passwordForm.new_password" type="password" placeholder="Mínimo 6 caracteres" />
          </UFormField>
          <UFormField label="Confirmar nova senha">
            <UInput v-model="passwordForm.confirm_password" type="password" />
          </UFormField>
        </div>

        <UAlert
          v-if="passwordError"
          color="error"
          variant="soft"
          :description="passwordError"
          class="mt-4"
        />
        <UAlert
          v-if="passwordSuccess"
          color="success"
          variant="soft"
          :description="passwordSuccess"
          class="mt-4"
        />

        <div class="flex justify-end mt-4">
          <UButton
            color="primary"
            label="Alterar Senha"
            :loading="passwordSaving"
            @click="changePassword"
          />
        </div>
      </div>
    </template>
  </div>
</template>
