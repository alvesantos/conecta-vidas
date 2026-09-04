<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

const { api } = useApi();
const toast = useToast();

const templateOptions = [
  { label: 'Bem-vindo à plataforma', value: 'bem_vindo' },
  { label: 'Sua consulta foi marcada', value: 'consulta_marcada' },
  { label: 'Sentimos sua falta (1 semana sem acessar)', value: 'sentimos_sua_falta' },
];

const selectedTemplate = ref('bem_vindo');
const sending = ref(false);

async function sendTest() {
  sending.value = true;
  try {
    await api('/admin/marketing/test-send', { method: 'POST', body: { template: selectedTemplate.value } });
    toast.add({ title: 'E-mail de teste enviado', description: 'Confira em ebagabe.2025@gmail.com.', color: 'success' });
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    toast.add({ title: 'Não foi possível enviar', description: fetchErr?.data?.error, color: 'error' });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Configurações</h1>
      <p class="text-gray-500 text-sm mt-1">Ajustes gerais da plataforma</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-bold text-gray-800 mb-1">Testar envio de e-mail</h2>
      <p class="text-sm text-gray-500 mb-4">
        Escolha um template e envie um exemplo pra visualizar como fica. O teste sempre vai pra
        <strong>ebagabe.2025@gmail.com</strong>, independente de quem disparar.
      </p>

      <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
        <UFormField label="Template" class="flex-1">
          <USelect v-model="selectedTemplate" :items="templateOptions" class="w-full" />
        </UFormField>
        <UButton label="Enviar teste" icon="i-heroicons-paper-airplane" :loading="sending" @click="sendTest" />
      </div>

      <p class="text-xs text-gray-400 mt-4">
        "Sentimos sua falta" é só o template — o disparo automático depois de 1 semana sem acesso ainda não existe, é um próximo passo.
      </p>
    </div>
  </div>
</template>
