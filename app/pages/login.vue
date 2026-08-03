<script setup lang="ts">
import { PORTALS, PORTAL_KEYS, isPortalKey, type PortalKey } from '~/config/portals'

definePageMeta({ noPadding: true })

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const accountStatus = ref<'pending' | 'rejected' | 'suspended' | null>(null)

const { login, user } = useAuth()
const route = useRoute()
const initialPortal = isPortalKey(route.query.portal) ? route.query.portal : 'cliente'
const activePortal = ref<PortalKey>(initialPortal)
const portal = computed(() => PORTALS[activePortal.value])
const registerLink = computed(() =>
  activePortal.value === 'cliente'
    ? '/cadastro'
    : `/cadastro/${activePortal.value}`,
)
const registerLabel = computed(() => {
  if (activePortal.value === 'medico') return 'Cadastre-se como médico'
  if (activePortal.value === 'veterinario') return 'Cadastre-se como veterinário'
  return 'Cadastre-se como cliente'
})

watch(activePortal, async (value) => {
  errorMsg.value = ''
  accountStatus.value = null
  await navigateTo({
    path: '/login',
    query: {
      ...route.query,
      portal: value,
      redirect: undefined,
    },
  }, { replace: true })
})

// Aviso quando a sessão expirou e o usuário foi redirecionado para cá.
const sessionExpired = computed(() => route.query.expired === '1')

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Preencha e-mail e senha.'
    return
  }

  loading.value = true
  errorMsg.value = ''
  accountStatus.value = null

  try {
    await login(email.value, password.value, activePortal.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    if (redirect && (redirect === portal.value.base || redirect.startsWith(`${portal.value.base}/`))) {
      await navigateTo(redirect)
    } else {
      await navigateTo(portal.value.home)
    }
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: string; code?: string } }
    const code = fetchError.data?.code
    if (code === 'ACCOUNT_PENDING') accountStatus.value = 'pending'
    else if (code === 'ACCOUNT_REJECTED') accountStatus.value = 'rejected'
    else if (code === 'ACCOUNT_SUSPENDED') accountStatus.value = 'suspended'
    else errorMsg.value = fetchError.data?.error ?? 'Erro ao fazer login.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-xl bg-white dark:bg-[#012347] rounded-2xl shadow-lg p-6 sm:p-10 lg:p-14 flex flex-col gap-7">
      <div class="flex flex-col items-center gap-3">
        <img src="/conecta-icon.png" alt="ConectaVidas" class="h-36 sm:h-44" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Entrar como {{ portal.loginLabel }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1 dark:bg-white/5 sm:grid-cols-4" aria-label="Escolha o portal">
        <button
          v-for="key in PORTAL_KEYS"
          :key="key"
          class="flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors"
          :class="activePortal === key ? 'bg-white text-body-strong shadow-sm dark:bg-white/10' : 'text-body-muted hover:text-body-strong'"
          :aria-pressed="activePortal === key"
          type="button"
          @click="activePortal = key"
        >
          <UIcon :name="PORTALS[key].icon" class="size-4 shrink-0" />
          {{ PORTALS[key].loginLabel }}
        </button>
      </div>

      <div
        v-if="sessionExpired"
        class="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
      >
        <UIcon name="i-heroicons-clock" class="size-5 shrink-0" />
        Sua sessão expirou. Faça login novamente para continuar.
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-if="accountStatus"
          class="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        >
          <p class="font-semibold">
            {{ accountStatus === 'pending' ? 'Cadastro em análise' : accountStatus === 'rejected' ? 'Cadastro não aprovado' : 'Conta suspensa' }}
          </p>
          <p class="mt-1">
            {{ accountStatus === 'pending' ? 'Nossa equipe ainda está analisando seu cadastro profissional.' : 'Entre em contato com o suporte para consultar os detalhes da sua conta.' }}
          </p>
        </div>
        <UInput
          v-model="email"
          type="email"
          placeholder="E-mail"
          size="lg"
          icon="i-heroicons-envelope"
          :disabled="loading"
        />
        <UInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          size="lg"
          icon="i-heroicons-lock-closed"
          :disabled="loading"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>

        <p v-if="errorMsg" class="text-sm text-red-500 text-center">{{ errorMsg }}</p>
      </div>

      <UButton
        label="Entrar"
        :icon="portal.icon"
        size="lg"
        class="w-full justify-center text-white"
        :style="{ backgroundColor: portal.accent }"
        :loading="loading"
        @click="handleLogin"
      />

      <p v-if="activePortal !== 'adm'" class="text-center text-sm text-gray-500 dark:text-gray-400">
        <NuxtLink :to="registerLink" class="font-medium hover:underline" :style="{ color: portal.accent }">
          {{ registerLabel }}
        </NuxtLink>
        <span v-if="activePortal === 'medico' || activePortal === 'veterinario'" class="mt-1 block text-xs">
          Cadastro profissional com {{ activePortal === 'medico' ? 'CRM' : 'CRMV' }} e aprovação administrativa.
        </span>
      </p>
    </div>
  </div>
</template>
