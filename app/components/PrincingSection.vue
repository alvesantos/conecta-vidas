<script setup lang="ts">
import { plans } from '../localData/plans';
import type { Plan } from '../interfaces/plans';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  reduced: {
    type: Boolean,
    default: true
  }
});

const displayedPerks = (plan: Plan) => {
  if (!props.reduced) return plan.perks
  const limited = plan.perks.slice(0, 6)
  limited.push({ icon: 'i-ph-info', label: 'Clique para ver mais benefícios!' })
  return limited
}

const navigateToRoute = (route: string) => {
  router.push(route);
}
</script>

<template>
  <div>
    <UCard>
      <h4 class="lg:block hidden lg:text-2xl font-semibold text-primary text-center mb-4">Assine e tenha acesso a conteúdos exclusivos de primeiros socorros e cuidados com seu pet.</h4>
      <h4 class="block lg:hidden text-2xl font-semibold text-primary text-center mb-4">Assine já!</h4>

      <section>
        <div class="grid lg:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.id" class="flex">
            <!-- Card wrapper -->
            <div 
              class="relative border-2 rounded-2xl shadow-lg flex flex-col flex-1"
              :style="{ borderColor: plan.color }"
            >
              <!-- Title -->
              <div 
                class=" font-bold text-xl mb-4 rounded-t-xl px-2 py-3"
                :class="plan.id !== 0 ? 'text-foreground' : 'text-primary'"
                :style="{ backgroundColor: plan.color }"
              >
                <div class="flex justify-center gap-2">
                  <div>
                    {{ plan.title }}
                  </div>

                  <span v-if="plan.id === 2" class="">
                    <UIcon name="i-ph-crown" class="text-yellow-500 size-6" />
                  </span>
                </div>

                <p 
                  class="lg:text-sm text-xs text-center font-normal"
                  :class="plan.id === 0 ? 'text-primary/70' : 'text-foreground/70'"
                >{{ plan.focus_desc }}</p>
              </div>

              <div class="px-4 flex flex-col flex-1">
                <!-- Price and Focus -->
                <p class="text-primary lg:text-4xl text-2xl font-bold text-center">
                  {{ plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}/mês
                </p>
                <p class="text-primary/60 font-semibold text-center mb-4 text-sm min-h-[3rem] line-clamp-2">{{ plan.focus }}</p>

                <!-- Perks -->
                <ul class="space-y-2 mb-4 flex flex-col flex-1 justify-between">
                  <li v-for="perk in displayedPerks(plan)" :key="perk.label" class="flex items-center gap-2">
                    <div 
                      @click="perk.icon === 'i-ph-info' && navigateToRoute('/assinaturas')"
                      class=" rounded-full px-3 py-3 flex items-center border"
                      :style="{ 
                        backgroundColor: plan.color,
                        borderColor: plan.id === 0 ? 'primary' : plan.color,
                      }"
                    >
                      <UIcon 
                        v-if="perk.icon" :name="perk.icon" class="size-6"
                        :class="plan.id === 0 ? 'text-primary' : 'text-foreground'"
                      />
                    </div>
                    <!-- Text -->
                    <span class="text-primary text-xs lg:text-base">{{ perk.label }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DOTTED BORDER INFO -->
      <div class="rounded-2xl border-dotted border-2 mt-4 py-2 flex flex-block">
        <img src="/maffy_gift.png" class="ml-2 w-[20%] lg:w-[8%] h-auto object-contain lg:mr-20" />
        <div class="flex flex-col justify-center px-4">
          <p class="text-primary font-bold text-sm lg:text-3xl">PRESENTINHOS INCLUSOS!</p>
          <p class="text-xs lg:text-xl">Presente Dia do Pai de Pet e Presente Dia da Mãe de Pet pelo MAFFYBOX!</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
</style>