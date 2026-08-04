<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })
const { activeProfile, loadProfiles } = usePatientProfile()
const veterinary = computed(() => activeProfile.value.kind === 'veterinaria')
const items = computed(() => veterinary.value
  ? [
      { label: 'Alimentação', description: 'Opções selecionadas para o bem-estar do seu pet.', icon: 'i-mdi-food-drumstick' },
      { label: 'Higiene e cuidados', description: 'Produtos para a rotina de cuidado animal.', icon: 'i-heroicons-sparkles' },
      { label: 'Farmácia veterinária', description: 'Benefícios em redes e parceiros veterinários.', icon: 'i-mdi-pill' },
    ]
  : [
      { label: 'Farmácias parceiras', description: 'Benefícios e descontos para sua saúde.', icon: 'i-mdi-pharmacy' },
      { label: 'Laboratórios', description: 'Serviços e condições de parceiros.', icon: 'i-heroicons-beaker' },
      { label: 'Bem-estar', description: 'Vantagens disponíveis no ecossistema ConectaVidas.', icon: 'i-heroicons-heart' },
    ],
)
onMounted(() => loadProfiles())
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-7">
    <section class="overflow-hidden rounded-3xl p-6 text-white shadow-sm sm:p-8" :class="veterinary ? 'bg-gradient-to-br from-sky-800 to-blue-950' : 'bg-gradient-to-br from-blue-900 to-slate-950'">
      <p class="text-sm font-medium text-white/70">{{ veterinary ? 'Contexto veterinário' : 'Contexto humano' }}</p>
      <h1 class="mt-2 text-3xl font-bold">{{ veterinary ? 'Maffy Store' : 'Benefícios ConectaVidas' }}</h1>
      <p class="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
        {{ veterinary ? `Produtos, serviços e vantagens pensados para ${activeProfile.label}.` : `Serviços e vantagens de saúde para ${activeProfile.label}.` }}
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <UCard v-for="item in items" :key="item.label">
        <span class="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-[var(--portal-accent)] dark:bg-white/10"><UIcon :name="item.icon" class="size-7" /></span>
        <h2 class="mt-4 font-semibold text-body-strong">{{ item.label }}</h2>
        <p class="mt-1 text-sm text-body-muted">{{ item.description }}</p>
        <UBadge label="Em preparação" color="neutral" variant="soft" class="mt-4" />
      </UCard>
    </section>

    <UAlert
      title="Catálogo em preparação"
      description="A estrutura contextual está pronta. Produtos, parceiros, descontos e regras comerciais serão publicados após aprovação da cliente."
      color="info"
      variant="soft"
      icon="i-heroicons-information-circle"
    />
  </div>
</template>
