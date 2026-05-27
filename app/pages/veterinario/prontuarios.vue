<script setup lang="ts">
definePageMeta({ layout: 'veterinario', middleware: 'veterinario' });
</script>

<template>
  <div class="max-w-5xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Prontuários</h1>
      <p class="text-gray-500 text-sm mt-1">Gerencie os prontuários dos seus pacientes</p>
    </div>

    <div class="bg-white rounded-xl shadow p-12 text-center">
      <UIcon name="i-heroicons-clipboard-document-list" class="size-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 text-lg">Em breve</p>
      <p class="text-gray-400 text-sm mt-1">
        A funcionalidade de prontuários está sendo desenvolvida e estará disponível em breve.
      </p>
    </div>
  </div>
</template>
