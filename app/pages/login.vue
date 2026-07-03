<script setup lang="ts">
definePageMeta({ noPadding: true })

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const { login, user } = useAuth()
const route = useRoute()

// Aviso quando a sessão expirou e o usuário foi redirecionado para cá.
const sessionExpired = computed(() => route.query.expired === '1')

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Preencha e-mail e senha.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await login(email.value, password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    if (redirect) {
      await navigateTo(redirect)
    } else if (user.value?.type === 'veterinario') {
      await navigateTo('/veterinario/consultas')
    } else if (user.value?.type === 'admin') {
      await navigateTo('/backoffice')
    } else {
      await navigateTo('/')
    }
  } catch (err) {
    errorMsg.value = err instanceof Error ? err.message : 'Erro ao fazer login.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-xl bg-white dark:bg-[#012347] rounded-2xl shadow-lg p-14 flex flex-col gap-8">
      <div class="flex flex-col items-center gap-3">
        <img src="/conecta-icon.png" alt="ConectaVidas" class="h-48" />
        <p class="text-sm text-gray-500 dark:text-gray-400">Acesse sua conta</p>
      </div>

      <div
        v-if="sessionExpired"
        class="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
      >
        <UIcon name="i-heroicons-clock" class="size-5 shrink-0" />
        Sua sessão expirou. Faça login novamente para continuar.
      </div>

      <div class="flex flex-col gap-4">
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
        size="lg"
        class="w-full justify-center bg-accent text-white"
        :loading="loading"
        @click="handleLogin"
      />

      <p class="text-center text-sm text-gray-500 dark:text-gray-400">
        Não tem uma conta?
        <NuxtLink to="/cadastro" class="text-accent font-medium hover:underline">
          Cadastre-se
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
