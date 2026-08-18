<script setup lang="ts">
import { plans as fallbackPlans } from '../localData/plans';
import type { Plan, Subscription } from '../interfaces/plans';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

const router = useRouter();
const { isLoggedIn } = useAuth();
const { listPublic, getMySubscription, subscribe } = usePlans();

const props = defineProps({
  reduced: {
    type: Boolean,
    default: true,
  },
});

const plans = ref<Plan[]>(fallbackPlans);
const subscription = ref<Subscription | null>(null);
const loadingAction = ref<string | null>(null);
const actionError = ref('');

const isSubscriptionView = computed(() => !props.reduced);

const currentPlanId = computed(() => subscription.value?.plan_id ?? null);

function priceOf(plan: Plan): number {
  return typeof plan.price === 'string' ? Number(plan.price) : plan.price;
}

const displayedPerks = (plan: Plan) => {
  if (!props.reduced) return plan.perks;
  const limited = (plan.perks ?? []).slice(0, 6);
  limited.push({ icon: 'i-ph-info', label: 'Clique para ver mais benefícios!' });
  return limited;
};

// Landing: apenas os destaques principais de cada plano
const topPerks = (plan: Plan) => (plan.perks ?? []).slice(0, 3);

const highlightedPlanId = computed(() => plans.value[1]?.id ?? null);

const navigateToRoute = (route: string) => {
  router.push(route);
};

async function handlePrimaryAction(plan: Plan) {
  // Landing: leva para /assinaturas
  if (!isSubscriptionView.value) {
    navigateToRoute('/assinaturas');
    return;
  }

  if (!isLoggedIn.value) {
    navigateToRoute('/login');
    return;
  }

  // /assinaturas: contrata o plano
  if (currentPlanId.value === plan.id) {
    // Já tem esse plano — placeholder de gerenciar
    return;
  }

  loadingAction.value = String(plan.id);
  actionError.value = '';
  try {
    subscription.value = await subscribe(String(plan.id));
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    actionError.value = fetchErr?.data?.error ?? 'Não foi possível atualizar a assinatura.';
  } finally {
    loadingAction.value = null;
  }
}

function buttonLabel(plan: Plan) {
  if (!isSubscriptionView.value) return 'Adquirir plano';
  if (!isLoggedIn.value) return 'Entrar para assinar';
  if (currentPlanId.value === plan.id) return 'Plano atual';
  return currentPlanId.value ? 'Trocar para este plano' : 'Adquirir plano';
}

onMounted(async () => {
  try {
    const apiPlans = await listPublic();
    if (apiPlans?.length) plans.value = apiPlans;
  } catch {
    // mantém fallback
  }
  if (isSubscriptionView.value && isLoggedIn.value) {
    try {
      subscription.value = await getMySubscription();
    } catch {
      subscription.value = null;
    }
  }
});
</script>

<template>
  <!-- ============ LANDING: VERSÃO MINIMALISTA ============ -->
  <div v-if="reduced">
    <div class="text-center max-w-2xl mx-auto">
      <span
        class="inline-flex items-center rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide px-3.5 py-1.5 uppercase"
      >
        Planos
      </span>
      <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary">
        Escolha o plano ideal
      </h2>
      <p class="mt-3 text-body-muted text-base sm:text-lg">
        Cuidado contínuo para o seu animal, a partir de
        <strong class="text-primary">R$ 39,90/mês</strong>.
      </p>
    </div>

    <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        :class="highlightedPlanId === plan.id
          ? 'border-accent ring-1 ring-accent/40 sm:scale-[1.02]'
          : 'border-accent/15'"
      >
        <span
          v-if="highlightedPlanId === plan.id"
          class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full shadow"
        >
          MAIS POPULAR
        </span>

        <h3 class="text-lg font-semibold text-primary">
          {{ plan.title }}
        </h3>
        <p class="mt-3 flex items-baseline gap-1">
          <span class="text-3xl font-bold text-primary">
            {{ priceOf(plan).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </span>
          <span class="text-sm text-body-muted">/mês</span>
        </p>
        <p class="mt-2 text-sm text-body-muted line-clamp-2 min-h-10">
          {{ plan.focus }}
        </p>

        <ul class="mt-5 space-y-2.5 flex-1">
          <li
            v-for="perk in topPerks(plan)"
            :key="perk.label"
            class="flex items-start gap-2.5"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="size-5 shrink-0 text-accent mt-0.5"
            />
            <span class="text-sm text-primary/80 line-clamp-2">
              {{ perk.label }}
            </span>
          </li>
        </ul>

        <UButton
          block
          size="lg"
          :color="highlightedPlanId === plan.id ? 'primary' : 'neutral'"
          :variant="highlightedPlanId === plan.id ? 'solid' : 'outline'"
          class="mt-6 font-semibold"
          @click="navigateToRoute('/assinaturas')"
        >
          Ver detalhes
        </UButton>
      </div>
    </div>

    <div class="mt-8 text-center">
      <UButton
        to="/assinaturas"
        variant="link"
        color="primary"
        trailing-icon="i-heroicons-arrow-right"
        class="font-semibold"
      >
        Ver todos os planos e benefícios
      </UButton>
    </div>
  </div>

  <!-- ============ ASSINATURAS: VERSÃO COMPLETA ============ -->
  <div v-else>
    <UCard>
      <h4 class="lg:block hidden lg:text-2xl font-semibold text-primary text-center mb-4">
        Assine e tenha acesso a conteúdos exclusivos de primeiros socorros e cuidados com seu animal.
      </h4>
      <h4 class="block lg:hidden text-2xl font-semibold text-primary text-center mb-4">Assine já!</h4>

      <p
        v-if="isSubscriptionView && isLoggedIn && subscription"
        class="text-center text-sm text-primary mb-4"
      >
        Você está no plano <strong>{{ subscription.plan_title }}</strong>.
      </p>
      <p
        v-else-if="isSubscriptionView && isLoggedIn && !subscription"
        class="text-center text-sm text-primary/70 mb-4"
      >
        Você ainda não possui um plano (plano <strong>Free</strong>).
      </p>

      <UAlert
        v-if="actionError"
        color="error"
        variant="soft"
        :description="actionError"
        icon="i-heroicons-exclamation-circle"
        class="mb-4"
      />

      <section>
        <div class="grid lg:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.id" class="flex">
            <div
              class="relative border-2 rounded-2xl shadow-lg flex flex-col flex-1"
              :style="{ borderColor: plan.color }"
            >
              <!-- Badge plano atual -->
              <span
                v-if="isSubscriptionView && currentPlanId === plan.id"
                class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow"
              >
                PLANO ATUAL
              </span>

              <div
                class="font-bold text-xl mb-4 rounded-t-xl px-2 py-3"
                :class="plan.color === '#FAF9F6' ? 'text-primary' : 'text-foreground'"
                :style="{ backgroundColor: plan.color }"
              >
                <div class="flex justify-center gap-2">
                  <div>{{ plan.title }}</div>
                </div>
                <p
                  class="lg:text-sm text-xs text-center font-normal"
                  :class="plan.color === '#FAF9F6' ? 'text-primary/70' : 'text-foreground/70'"
                >
                  {{ plan.focus_desc }}
                </p>
              </div>

              <div class="px-4 flex flex-col flex-1">
                <p class="text-primary lg:text-4xl text-2xl font-bold text-center">
                  {{ priceOf(plan).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}/mês
                </p>
                <p class="text-primary/60 font-semibold text-center mb-4 text-sm min-h-[3rem] line-clamp-2">
                  {{ plan.focus }}
                </p>

                <ul class="space-y-2 mb-4 flex flex-col flex-1 justify-between">
                  <li
                    v-for="perk in displayedPerks(plan)"
                    :key="perk.label"
                    class="flex items-center gap-2"
                    :class="{ 'cursor-pointer': perk.icon === 'i-ph-info' }"
                    @click="perk.icon === 'i-ph-info' && navigateToRoute('/assinaturas')"
                  >
                    <div
                      class="rounded-full px-3 py-3 flex items-center border"
                      :style="{ backgroundColor: plan.color, borderColor: plan.color }"
                    >
                      <UIcon
                        v-if="perk.icon"
                        :name="perk.icon"
                        class="size-6"
                        :class="plan.color === '#FAF9F6' ? 'text-primary' : 'text-foreground'"
                      />
                    </div>
                    <span class="text-primary text-xs lg:text-base">{{ perk.label }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  class="cursor-pointer w-full py-3 rounded-b-xl font-semibold transition-all duration-200 border-2 hover:opacity-90 hover:scale-[1.01]"
                  :class="plan.color === '#FAF9F6' ? 'text-primary' : 'text-foreground'"
                  :style="{ backgroundColor: plan.color, borderColor: plan.color }"
                  :disabled="loadingAction === String(plan.id)"
                  @click="handlePrimaryAction(plan)"
                >
                  {{ loadingAction === String(plan.id) ? 'Processando...' : buttonLabel(plan) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="rounded-2xl border-dotted border-2 mt-4 py-2 flex flex-block">
        <img src="/maffy_gift.png" class="ml-2 w-[20%] lg:w-[8%] h-auto object-contain lg:mr-20" />
        <div class="flex flex-col justify-center px-4">
          <p class="text-primary font-bold text-sm lg:text-3xl">PRESENTINHOS INCLUSOS!</p>
          <p class="text-xs lg:text-xl">Presente Dia do Pai de Animal e Presente Dia da Mãe de Animal pelo MAFFYBOX!</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
