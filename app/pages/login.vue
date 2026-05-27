<script setup lang="ts">
definePageMeta({ noPadding: true })

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const { login, user } = useAuth()

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Preencha e-mail e senha.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await login(email.value, password.value)
    if (user.value?.type === 'veterinario') {
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
    <div class="w-full max-w-xl bg-white rounded-2xl shadow-lg p-14 flex flex-col gap-8">
      <div class="flex flex-col items-center gap-3">
        <img src="/icon-com-texto.png" alt="Conecta Vet" class="h-48" />
        <p class="text-sm text-gray-500">Acesse sua conta</p>
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

      <p class="text-center text-sm text-gray-500">
        Não tem uma conta?
        <NuxtLink to="/cadastro" class="text-accent font-medium hover:underline">
          Cadastre-se
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
