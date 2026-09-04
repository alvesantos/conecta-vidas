<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Financeiro</h1>
      <p class="text-gray-500 text-sm mt-1">Recebimentos e repasses (Split) via Asaas</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div class="size-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-arrow-down-circle" class="size-6 text-green-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Valor Recebido</p>
          <p class="text-3xl font-bold text-gray-800">R$ 0,00</p>
          <p class="text-xs text-gray-400 mt-1">Disponível após a integração com o Asaas.</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div class="size-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-arrow-up-circle" class="size-6 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Valor Repassado (Split)</p>
          <p class="text-3xl font-bold text-gray-800">R$ 0,00</p>
          <p class="text-xs text-gray-400 mt-1">Disponível após a integração com o Asaas.</p>
        </div>
      </div>
    </div>
  </div>
</template>
