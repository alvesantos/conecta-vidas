<script setup lang="ts">
const email = ref('')
const password = ref('')
const showPassword = ref(false)
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
        />
        <UInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          size="lg"
          icon="i-heroicons-lock-closed"
          :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
          @click-trailing="showPassword = !showPassword"
        />
      </div>

      <UButton
        label="Entrar"
        size="lg"
        class="w-full justify-center bg-accent text-white"
      />
    </div>
  </div>
</template>
