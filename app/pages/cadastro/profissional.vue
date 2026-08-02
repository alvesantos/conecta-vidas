<script setup lang="ts">
import { vMaska } from 'maska/vue'

definePageMeta({ noPadding: true })

type ProfessionalType = 'medico' | 'veterinario'

const route = useRoute()
const config = useRuntimeConfig()
const initialType: ProfessionalType = route.query.tipo === 'veterinario' ? 'veterinario' : 'medico'
const type = ref<ProfessionalType>(initialType)
const loading = ref(false)
const completed = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)
const form = reactive({
  name: '',
  cpf: '',
  email: '',
  phone: '',
  registration: '',
  zip_code: '',
  house_number: '',
  address: '',
  password: '',
  confirmPassword: '',
})
const errors = reactive<Record<string, string>>({})

const typeOptions = [
  { value: 'medico' as const, label: 'Médico', icon: 'i-mdi-doctor', accent: '#16A34A' },
  { value: 'veterinario' as const, label: 'Veterinário', icon: 'i-mdi-stethoscope', accent: '#014496' },
]
const selected = computed(() => typeOptions.find(option => option.value === type.value)!)
const registrationLabel = computed(() => type.value === 'medico' ? 'CRM' : 'CRMV')

watch(type, () => {
  form.registration = ''
  delete errors.registration
})

function isValidCpf(value: string) {
  const cpf = value.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const digit = (factor: number, length: number) => {
    let sum = 0
    for (let index = 0; index < length; index++) sum += Number(cpf[index]) * (factor - index)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return digit(10, 9) === Number(cpf[9]) && digit(11, 10) === Number(cpf[10])
}

function validate() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!form.name.trim()) errors.name = 'Nome obrigatório.'
  if (!isValidCpf(form.cpf)) errors.cpf = 'CPF inválido.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'E-mail inválido.'
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Telefone inválido.'
  if (!form.registration.trim()) errors.registration = `${registrationLabel.value} obrigatório.`
  if (form.password.length < 6) errors.password = 'Use pelo menos 6 caracteres.'
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'As senhas não coincidem.'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch(`${config.public.apiBase}/auth/register-professional`, {
      method: 'POST',
      body: {
        type: type.value,
        name: form.name,
        cpf: form.cpf,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address || undefined,
        zip_code: form.zip_code || undefined,
        house_number: form.house_number || undefined,
        [type.value === 'medico' ? 'crm' : 'crmv']: form.registration,
      },
    })
    completed.value = true
  } catch (err: unknown) {
    errorMsg.value = (err as { data?: { error?: string } }).data?.error
      ?? 'Não foi possível enviar o cadastro.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-10">
    <UCard class="mx-auto max-w-2xl">
      <div v-if="completed" class="flex flex-col items-center py-12 text-center">
        <span class="flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10">
          <UIcon name="i-heroicons-check-circle" class="size-11" />
        </span>
        <h1 class="mt-6 text-2xl font-bold text-body-strong">Recebemos seu cadastro</h1>
        <p class="mt-3 max-w-lg text-body-muted">
          Seus dados foram enviados para análise. Você poderá acessar o Portal {{ selected.label }}
          assim que o cadastro for aprovado.
        </p>
        <UButton to="/login" label="Voltar ao login" class="mt-7" :style="{ backgroundColor: selected.accent }" />
      </div>

      <form v-else class="space-y-6" @submit.prevent="submit">
        <div class="text-center">
          <img src="/conecta-icon.png" alt="ConectaVidas" class="mx-auto h-32" />
          <h1 class="text-2xl font-bold text-body-strong">Cadastro profissional</h1>
          <p class="mt-1 text-sm text-body-muted">Escolha sua área e envie os dados para credenciamento.</p>
        </div>

        <div class="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 dark:bg-white/5">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            class="flex min-h-12 items-center justify-center gap-2 rounded-lg text-sm font-medium"
            :class="type === option.value ? 'bg-white shadow-sm dark:bg-white/10' : 'text-body-muted'"
            :aria-pressed="type === option.value"
            @click="type = option.value"
          >
            <UIcon :name="option.icon" class="size-5" />
            {{ option.label }}
          </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Nome completo" required :error="errors.name" class="sm:col-span-2">
            <UInput v-model="form.name" icon="i-heroicons-user" class="w-full" />
          </UFormField>
          <UFormField label="CPF" required :error="errors.cpf">
            <UInput v-model="form.cpf" v-maska="'###.###.###-##'" icon="i-heroicons-identification" class="w-full" />
          </UFormField>
          <UFormField :label="registrationLabel" required :error="errors.registration">
            <UInput v-model="form.registration" :placeholder="`${registrationLabel} + UF`" icon="i-heroicons-document-check" class="w-full" />
          </UFormField>
          <UFormField label="E-mail" required :error="errors.email">
            <UInput v-model="form.email" type="email" icon="i-heroicons-envelope" class="w-full" />
          </UFormField>
          <UFormField label="Telefone/WhatsApp" required :error="errors.phone">
            <UInput v-model="form.phone" v-maska="['(##) ####-####', '(##) #####-####']" icon="i-heroicons-phone" class="w-full" />
          </UFormField>
          <UFormField label="CEP">
            <UInput v-model="form.zip_code" v-maska="'#####-###'" icon="i-heroicons-map" class="w-full" />
          </UFormField>
          <UFormField label="Número">
            <UInput v-model="form.house_number" icon="i-heroicons-home" class="w-full" />
          </UFormField>
          <UFormField label="Endereço" class="sm:col-span-2">
            <UInput v-model="form.address" icon="i-heroicons-map-pin" class="w-full" />
          </UFormField>
          <UFormField label="Senha" required :error="errors.password">
            <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'" icon="i-heroicons-lock-closed" class="w-full">
              <template #trailing>
                <UButton type="button" color="neutral" variant="link" :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" @click="showPassword = !showPassword" />
              </template>
            </UInput>
          </UFormField>
          <UFormField label="Confirmar senha" required :error="errors.confirmPassword">
            <UInput v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" icon="i-heroicons-lock-closed" class="w-full" />
          </UFormField>
        </div>

        <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" />
        <UAlert color="warning" variant="soft" title="Cadastro sujeito à aprovação" description="O envio não libera acesso imediato. A equipe administrativa analisará seu registro profissional." />

        <UButton
          type="submit"
          block
          size="lg"
          label="Enviar cadastro para análise"
          :icon="selected.icon"
          :loading="loading"
          class="text-white"
          :style="{ backgroundColor: selected.accent }"
        />
        <p class="text-center text-sm text-body-muted">
          Já possui cadastro?
          <NuxtLink :to="`/login?portal=${type}`" class="font-medium underline">Entrar</NuxtLink>
        </p>
      </form>
    </UCard>
  </div>
</template>
