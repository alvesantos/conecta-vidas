<script setup lang="ts">
const activePlan = { name: 'Intermediário' }

const plans = [
  {
    name: 'Básico',
    price: 19.90,
    period: 'mensal' as const,
    description: 'Conteúdos Essenciais',
    features: [
      'Artigos e guias de saúde pet',
      'Dicas de cuidados e nutrição',
      'Acesso à biblioteca básica de conteúdos',
      '1 pet cadastrado',
    ],
    highlighted: false,
  },
  {
    name: 'Intermediário',
    price: 49.90,
    period: 'mensal' as const,
    description: 'Conteúdos Ampliados e Suporte',
    badge: 'Mais popular',
    features: [
      'Tudo do plano Básico',
      'Conteúdos exclusivos e aprofundados',
      'Suporte por chat com veterinários',
      'Até 3 pets cadastrados',
      'Histórico de consultas',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 89.90,
    period: 'mensal' as const,
    description: 'Experiência Completa e Prioridade',
    features: [
      'Tudo do plano Intermediário',
      'Atendimento por vídeo ilimitado',
      'Suporte prioritário 24/7',
      'Pets ilimitados',
      'Descontos em exames e vacinas',
      'Relatórios de saúde personalizados',
    ],
    highlighted: false,
  },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-xl font-bold text-[#01193a]">Planos</h2>

    <div class="flex flex-row gap-4">
      <PlanCard
        v-for="plan in plans"
        :key="plan.name"
        v-bind="plan"
        :active="plan.name === activePlan.name"
      >
        <template #action>
          <UButton
            v-if="plan.name === activePlan.name"
            label="Gerenciar Assinatura"
            size="sm"
            class="w-full justify-center bg-white/20 hover:bg-white/30 text-white border border-white/30 cursor-pointer"
            variant="ghost"
            icon="i-heroicons-cog-6-tooth"
          />
          <UButton
            v-else
            label="Assinar"
            size="sm"
            class="w-full justify-center cursor-pointer"
            variant="solid"
          />
        </template>
      </PlanCard>
    </div>
  </div>
</template>
