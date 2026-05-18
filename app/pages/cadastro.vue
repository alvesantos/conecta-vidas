<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')
const address = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-10">
    <div class="w-full max-w-xl bg-white rounded-2xl shadow-lg p-14 flex flex-col gap-8">
      <div class="flex flex-col items-center gap-3">
        <img src="/icon-com-texto.png" alt="Conecta Vet" class="h-48" />
        <p class="text-sm text-gray-500">Crie sua conta de tutor</p>
      </div>

      <div class="flex flex-col gap-4">
        <UInput
          v-model="name"
          type="text"
          placeholder="Nome completo"
          size="lg"
          icon="i-heroicons-user"
        />

        <UInput
          v-model="email"
          type="email"
          placeholder="E-mail"
          size="lg"
          icon="i-heroicons-envelope"
        />

        <UInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          size="lg"
          icon="i-heroicons-lock-closed"
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

        <UInput
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirmar senha"
          size="lg"
          icon="i-heroicons-lock-closed"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              class="cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>

        <UInput
          v-model="phone"
          type="tel"
          placeholder="Telefone (opcional)"
          size="lg"
          icon="i-heroicons-phone"
        />

        <UInput
          v-model="address"
          type="text"
          placeholder="Endereço (opcional)"
          size="lg"
          icon="i-heroicons-map-pin"
        />
      </div>

      <UButton
        label="Criar conta"
        size="lg"
        class="w-full justify-center bg-accent text-white"
      />

      <p class="text-center text-sm text-gray-500">
        Já tem uma conta?
        <NuxtLink to="/login" class="text-accent font-medium hover:underline">
          Entrar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
