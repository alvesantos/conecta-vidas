<script setup lang="ts">
import type { Plan } from '../interfaces/plans';

defineProps<{
  reduced?: {
    type: boolean,
    default: true
  }
}>()

const plans: Plan[] = [
  // =================== ESSENCIAL =================== //
  {
    title: "Essencial",
    color: "#FAF9F6",
    focus: "Prevenção básica e suporte digital imediato",
    focus_desc: "Tutores que buscam cuidado eficiente, orientação confiável e praticidade no dia a dia do seu pet.",
    price: 39.90,
    perks: [
      { icon: "", label: "Cadastro de até 2 pets (cães e gatos)" },
      { icon: "", label: "Teletriagem Veterinária ILIMITADA (24h)" },
      { icon: "", label: "Consulta Virtual Agendada: 1 por mês" },
      { icon: "", label: "Plataforma de Conteúdo: Acesso completo incluso (Vídeos educativos, culinária e mais!)" },
      { icon: "", label: "Clube ConectaVet (Grupo VIP no WhatsApp)" },
      { icon: "", label: "Clube de Benefícios: Descontos Exclusivos na Boutique MAFFY" },
      { icon: "", label: "Benefício Aniversário ConectaVet: Surpresa especial para o seu pet, com cupom, parabéns personalizado e mais!" },
      { icon: "", label: "Envio de 1 Mini Kit Emergência Pet (Anual)" },
      { icon: "", label: "Consultas Virtuais Extras: Coparticipação inteligente (50% de desconto sobre o valor avulso)" }
    ],
  },

  // =================== CARE PLUS =================== //
  {
    title: "Care Plus",
    color: "#014496",
    focus: "Conforto e a tranquilidade de um suporte mais robusto",
    focus_desc: "Tutores que desejam mais suporte, comodidade e benefícios para cuidar melhor do seu pet.",
    price: 79.90,
    perks: [
      { icon: "", label: "Tudo incluso no Essencial" },
      { icon: "", label: "Teletriagem Veterinária ILIMITADA (24h) com Prioridade" },
      { icon: "", label: "Consulta Virtual Agendada ou Pronto Atendimento: 2 por mês" },
      { icon: "", label: "Envio de 1 Mini Kit Emergência Pet: Anual" },
      { icon: "", label: "Atendimento Veterinário Domiciliar: 5% de desconto em todos os atendimentos domiciliares" },
      { icon: "", label: "Exames Laboratoriais e de Imagem em Casa: Acesso a valores reduzidos de rede" },
      { icon: "", label: "Encontros Periódicos ConectaVet: Participação em encontros presenciais exclusivos com aulas práticas e socialização pet" },
      { icon: "", label: "Consultas Virtuais Extras: Coparticipação fixa de apenas R$ 29,00" }
    ]
  },

  // =================== SUPER PREMIUM =================== //
  {
    title: "Super Premium",
    color: "#01193A",
    focus: "A experiência máxima de exclusividade, comodidade e mimos físicos",
    focus_desc: "Tutores que querem o melhor em exclusividade, benefícios e mimos para seu pet.",
    price: 149.90,
    perks: [
      { icon: "", label: "Tudo incluso no Care Plus e Essencial" },
      { icon: "", label: "Teletriagem Veterinária ILIMITADA (24h) com Prioridade máxima" },
      { icon: "", label: "Consulta Virtual ou Pronto Atendimento: 4 por mês (inclui pets exóticos/silvestres)" },
      { icon: "", label: "Benefício Aniversário ConectaVet: Kit premium aniversário com mimos físicos, cupom exclusivo, parabéns personalizado e descontos de elite" },
      { icon: "", label: "MAFFYBOX: Envio mensal de brinquedos, petiscos e itens de moda pet ergonômica direto para sua casa" },
      { icon: "", label: "Coleta de Exames Laboratoriais em Domicílio: 100% inclusa (até 2x/ano para Check-up de Rotina)" },
      { icon: "", label: "Atendimento Veterinário Domiciliar: 10% de desconto em todos os atendimentos domiciliares" },
      { icon: "", label: "Ultrassonografia em Domicílio: Tarifa VIP com desconto exclusivo (1x/ano)" },
      { icon: "", label: "Encontros Periódicos ConectaVet com Surpresinhas: Participação em encontros presenciais exclusivos com aulas, ativações e surpresas especiais" },
      { icon: "", label: "Envio de 1 Mini Kit Emergência Pet Premium: Anual" },
      { icon: "", label: "Consultas Virtuais Extras: Coparticipação fixa de apenas R$ 19,00" }
    ]
  },
]
</script>

<template>
  <div>
    <UCard class="p-4">
      <h4 class="lg:block hidden lg:text-2xl font-semibold text-primary text-center mb-4">Assine e tenha acesso a conteúdos exclusivos de primeiros socorros e cuidados com seu pet.</h4>

      <section class="py-8 lg:py-16">
        <div class="grid lg:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.title">
            <!-- Card wrapper -->
            <div 
              class="relative border-2 rounded-2xl shadow-lg"
              :style="{ borderColor: plan.color }"
            >
              <!-- Title -->
              <div 
                class=" font-bold text-xl mb-4 rounded-t-xl px-2 py-3 flex justify-center gap-2"
                :class="plan.title !== 'Essencial' ? 'text-foreground' : 'text-primary'"
                :style="{ backgroundColor: plan.color }"
              >
                <div>
                  {{ plan.title }}
                </div>

                <span v-if="plan.title === 'Super Premium'" class="">
                  <UIcon name="i-ph-crown" class="text-yellow-500 size-6" />
                </span>
              </div>

              <div class="px-4">
                <!-- Focus / description -->
                <h4 class="text-primary font-semibold text-lg mb-2">{{ plan.focus }}</h4>
                <p class="text-primary/60 mb-4">{{ plan.focus_desc }}</p>

                <!-- Price -->
                <p class="text-primary text-2xl font-bold mb-4">R$ {{ plan.price.toFixed(2) }}/mês</p>

                <!-- Perks -->
                <ul class="space-y-2">
                  <li v-for="perk in plan.perks" :key="perk.label" class="flex items-center gap-2">
                    <!-- Icon placeholder -->
                    <UIcon v-if="perk.icon" :name="perk.icon" class="size-6 text-primary" />
                    <!-- Text -->
                    <span class="text-primary">{{ perk.label }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </UCard>
  </div>
</template>

<style scoped>
</style>