<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Prontuários</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerencie os prontuários dos seus pacientes</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div class="flex flex-col items-center justify-center py-16 text-center px-4">
        <UIcon name="i-heroicons-clipboard-document-list" class="size-16 text-gray-300 dark:text-gray-600 mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">Em breve</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1 max-w-sm">
          A funcionalidade de prontuários está sendo desenvolvida e estará disponível em breve.
        </p>
      </div>
    </div>
  </div>
</template>
