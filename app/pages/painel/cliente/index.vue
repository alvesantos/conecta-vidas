<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })
const { user } = useAuth()
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-body-strong">Olá, {{ user?.name?.split(' ')[0] }}</h2>
    <p class="mt-1 text-body-muted">Acompanhe aqui os cuidados da sua família e dos seus animais.</p>
    <div class="mt-7 grid gap-4 md:grid-cols-3">
      <UCard><UIcon name="i-heroicons-calendar-days" class="size-7 text-[var(--portal-accent)]" /><h3 class="mt-3 font-semibold text-body-strong">Próximas consultas</h3><p class="mt-1 text-sm text-body-muted">Nenhuma consulta próxima.</p></UCard>
      <UCard><UIcon name="i-mdi-paw" class="size-7 text-[var(--portal-accent)]" /><h3 class="mt-3 font-semibold text-body-strong">Meus pets</h3><p class="mt-1 text-sm text-body-muted">Gerencie os animais vinculados à sua conta.</p><UButton to="/painel/cliente/pets" label="Ver pets" variant="link" class="mt-2 px-0" /></UCard>
      <UCard><UIcon name="i-heroicons-credit-card" class="size-7 text-[var(--portal-accent)]" /><h3 class="mt-3 font-semibold text-body-strong">Minha assinatura</h3><p class="mt-1 text-sm text-body-muted">Consulte seu plano e benefícios.</p><UButton to="/painel/cliente/assinatura" label="Ver assinatura" variant="link" class="mt-2 px-0" /></UCard>
    </div>
  </div>
</template>
