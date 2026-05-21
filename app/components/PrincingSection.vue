<script setup lang="ts">
import { plans } from '../localData/plans';

defineProps<{
  reduced?: {
    type: boolean,
    default: true
  }
}>()
</script>

<template>
  <div>
    <UCard>
      <h4 class="lg:block hidden lg:text-2xl font-semibold text-primary text-center mb-4">Assine e tenha acesso a conteúdos exclusivos de primeiros socorros e cuidados com seu pet.</h4>
      <h4 class="block lg:hidden text-2xl font-semibold text-primary text-center mb-4">Assine já!</h4>

      <section>
        <div class="grid lg:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.id">
            <!-- Card wrapper -->
            <div 
              class="relative border-2 rounded-2xl shadow-lg"
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

              <div class="px-4">
                <!-- Price and Focus -->
                <p class="text-primary lg:text-4xl text-2xl font-bold text-center">
                  {{ plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}/mês
                </p>
                <p class="text-primary/60 font-semibold text-center mb-4">{{ plan.focus }}</p>

                <!-- Perks -->
                <ul class="space-y-2 mb-4">
                  <li v-for="perk in plan.perks" :key="perk.label" class="flex items-center gap-2">
                    <div 
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
                    <span class="text-primary">{{ perk.label }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DOTTED BORDER INFO -->
      <div>
        test
      </div>
    </UCard>
  </div>
</template>

<style scoped>
</style>