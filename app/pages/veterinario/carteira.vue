<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });

interface BalanceData {
  available_amount: number;
  waiting_funds_amount: number;
  transferred_amount: number;
}

const { api } = useApi();

const balance = ref<BalanceData | null>(null);
const pending = ref(true);
const errorMsg = ref('');

async function loadBalance() {
  pending.value = true;
  errorMsg.value = '';
  try {
    balance.value = await api<BalanceData>('/vet/balance');
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    errorMsg.value = fetchErr?.data?.error ?? 'Erro ao carregar saldo.';
  } finally {
    pending.value = false;
  }
}

onMounted(loadBalance);

function formatCurrency(value: number) {
  return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Carteira</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Acompanhe seu saldo e repasses</p>
    </div>

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :description="errorMsg"
      class="mb-4"
    />

    <div v-if="pending" class="text-center text-gray-400 py-12">Carregando...</div>

    <div v-else-if="balance" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Saldo disponível</p>
        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(balance.available_amount) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">A receber</p>
        <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(balance.waiting_funds_amount) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total transferido</p>
        <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(balance.transferred_amount) }}</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Histórico de repasses</h2>
        <UButton
          variant="soft"
          color="primary"
          label="Solicitar Saque"
          icon="i-heroicons-arrow-up-tray"
          disabled
        />
      </div>
      <p class="text-gray-400 text-sm text-center py-8">
        O histórico detalhado de repasses estará disponível em breve.
      </p>
    </div>
  </div>
</template>
