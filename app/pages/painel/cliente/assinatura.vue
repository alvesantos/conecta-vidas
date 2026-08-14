<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })
const { api } = useApi()
interface Entitlement { hasActivePlan: boolean; planTitle: string | null; freeConsultations: number; usedFreeThisMonth: number; remainingFree: number }
const entitlement = ref<Entitlement | null>(null)
const pending = ref(true)
onMounted(async () => {
  try { entitlement.value = await api('/consultations/entitlement') } finally { pending.value = false }
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Minha assinatura</h1><p class="mt-1 text-sm text-body-muted">Acompanhe o uso das consultas incluídas no mês atual.</p></div>
    <USkeleton v-if="pending" class="h-52 rounded-xl" />
    <UAlert v-else-if="!entitlement?.hasActivePlan" title="Sem assinatura ativa" description="Consultas solicitadas sem plano ativo são cobradas pelo valor avulso vigente." color="neutral" variant="soft" icon="i-heroicons-information-circle" />
    <UCard v-else>
      <template #header><div><p class="text-xs uppercase tracking-wide text-body-muted">Plano atual</p><h2 class="text-xl font-bold text-body-strong">{{ entitlement.planTitle }}</h2></div></template>
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl bg-gray-50 p-4 dark:bg-white/5"><span class="text-xs text-body-muted">Incluídas no mês</span><strong class="mt-1 block text-2xl text-body-strong">{{ entitlement.freeConsultations }}</strong></div>
        <div class="rounded-xl bg-gray-50 p-4 dark:bg-white/5"><span class="text-xs text-body-muted">Utilizadas</span><strong class="mt-1 block text-2xl text-body-strong">{{ entitlement.usedFreeThisMonth }}</strong></div>
        <div class="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10"><span class="text-xs text-body-muted">Disponíveis</span><strong class="mt-1 block text-2xl text-[var(--portal-accent)]">{{ entitlement.remainingFree }}</strong></div>
      </div>
      <p class="mt-4 text-xs text-body-muted">Consultas canceladas não consomem a cota mensal.</p>
    </UCard>
  </div>
</template>
