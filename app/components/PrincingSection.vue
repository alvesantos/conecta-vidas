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
        Cuidado contínuo para o seu pet, a partir de
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
  <!-- ============ ASSINATURAS: VERSÃO COMPLETA ============ -->
  <div v-else class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-6">
        Evolua o cuidado do seu pet
      </h2>
      <p class="text-lg md:text-xl text-gray-600 mb-8">
        Escolha o plano perfeito e tenha acesso a suporte 24h, consultas e mimos exclusivos.
      </p>

      <div v-if="isLoggedIn" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
        <UIcon name="i-heroicons-user" class="size-4" />
        <span v-if="subscription">Seu plano atual: <strong class="text-primary">{{ subscription.plan_title }}</strong></span>
        <span v-else>Você ainda não possui um plano (Free)</span>
      </div>

      <UAlert
        v-if="actionError"
        color="error"
        variant="soft"
        :description="actionError"
        icon="i-heroicons-exclamation-circle"
        class="mt-6 text-left"
      />
    </div>

    <div class="grid md:grid-cols-3 gap-8 items-start">
      <div 
        v-for="(plan, index) in plans" 
        :key="plan.id"
        class="relative flex flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
        :class="[
          index === 2 ? 'bg-[#01193A] text-white shadow-2xl ring-1 ring-white/10' : 'bg-white text-gray-900 shadow-xl ring-1 ring-gray-200',
          index === 1 ? 'md:-mt-4 md:mb-4 ring-2 ring-primary/60' : ''
        ]"
      >
        <!-- Badge plano atual -->
        <span
          v-if="currentPlanId === plan.id"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider"
        >
          Seu Plano
        </span>
        <!-- Badge popular -->
        <span
          v-else-if="index === 1"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider"
        >
          Mais Popular
        </span>

        <div class="mb-6">
          <h3 class="text-2xl font-bold mb-2" :class="index === 2 ? 'text-white' : 'text-primary'">{{ plan.title }}</h3>
          <p class="text-sm min-h-[3rem]" :class="index === 2 ? 'text-gray-300' : 'text-gray-500'">{{ plan.focus_desc }}</p>
        </div>

        <div class="mb-8">
          <p class="flex items-baseline gap-1">
            <span class="text-4xl font-extrabold tracking-tight" :class="index === 2 ? 'text-white' : 'text-gray-900'">
              {{ priceOf(plan).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </span>
            <span class="text-sm font-medium" :class="index === 2 ? 'text-gray-400' : 'text-gray-500'">/mês</span>
          </p>
          <p class="mt-2 text-sm font-semibold" :class="index === 2 ? 'text-accent' : 'text-primary/80'">{{ plan.focus }}</p>
        </div>

        <button
          class="w-full rounded-full py-3 px-4 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mb-8"
          :class="[
            currentPlanId === plan.id 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : index === 2 
                ? 'bg-white text-[#01193A] hover:bg-gray-100' 
                : index === 1 
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-md' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
          ]"
          :disabled="loadingAction === String(plan.id) || currentPlanId === plan.id"
          @click="handlePrimaryAction(plan)"
        >
          <UIcon v-if="loadingAction === String(plan.id)" name="i-heroicons-arrow-path" class="animate-spin size-4" />
          {{ loadingAction === String(plan.id) ? 'Processando...' : buttonLabel(plan) }}
        </button>

        <div class="flex-1">
          <ul class="space-y-4">
            <li
              v-for="perk in displayedPerks(plan)"
              :key="perk.label"
              class="flex items-start gap-3"
            >
              <UIcon
                :name="perk.icon || 'i-heroicons-check'"
                class="size-5 shrink-0 mt-0.5"
                :class="index === 2 ? 'text-accent' : 'text-primary'"
              />
              <span class="text-sm leading-tight" :class="index === 2 ? 'text-gray-200' : 'text-gray-600'">
                {{ perk.label }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Maffybox Banner -->
    <div class="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-10 border border-blue-100 shadow-sm flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
      <img src="/maffy_gift.png" alt="Maffybox" class="w-32 md:w-40 object-contain hover:scale-105 transition-transform" />
      <div class="text-center md:text-left">
        <h4 class="text-2xl font-bold text-primary mb-2 tracking-tight">Mimos e Presentinhos Inclusos!</h4>
        <p class="text-gray-600 text-lg">
          Assinantes recebem surpresas especiais no <strong>Dia do Pai de Pet</strong> e <strong>Dia da Mãe de Pet</strong> através do nosso exclusivo MAFFYBOX. Seu pet vai amar!
        </p>
      </div>
    </div>
  </div>
</template>
