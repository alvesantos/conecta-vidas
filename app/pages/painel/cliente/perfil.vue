<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface ProfileResponse {
  user: Record<string, string | null>
  health: {
    blood_type?: string | null
    allergies?: string | null
    comorbidities?: string | null
    continuous_medications?: string | null
  }
}

interface Consent {
  id: string
  consent_type: string
  policy_version: string
  granted_at: string
  revoked_at?: string | null
}

const { api } = useApi()
const profile = ref<ProfileResponse | null>(null)
const consents = ref<Consent[]>([])
const pending = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const health = reactive({
  blood_type: '',
  allergies: '',
  comorbidities: '',
  continuous_medications: '',
})

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(value => ({ label: value, value }))

async function load() {
  pending.value = true
  try {
    const [profileData, consentData] = await Promise.all([
      api<ProfileResponse>('/patient/profile'),
      api<Consent[]>('/patient/consents'),
    ])
    profile.value = profileData
    consents.value = consentData
    health.blood_type = profileData.health?.blood_type ?? ''
    health.allergies = profileData.health?.allergies ?? ''
    health.comorbidities = profileData.health?.comorbidities ?? ''
    health.continuous_medications = profileData.health?.continuous_medications ?? ''
  } finally {
    pending.value = false
  }
}

async function saveHealth() {
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    await api('/patient/health', { method: 'PUT', body: health })
    saved.value = true
  } catch (err: unknown) {
    error.value = (err as { data?: { error?: string } }).data?.error ?? 'Erro ao salvar ficha de saúde.'
  } finally {
    saving.value = false
  }
}

async function revoke(consent: Consent) {
  if (!window.confirm('Revogar este consentimento? Algumas funcionalidades podem ficar indisponíveis.')) return
  await api(`/patient/consents/${consent.id}/revoke`, { method: 'POST' })
  await load()
}

onMounted(load)
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Meu perfil</h1><p class="text-sm text-body-muted">Dados cadastrais, ficha de saúde e consentimentos.</p></div>
    <USkeleton v-if="pending" class="h-72 rounded-xl" />
    <template v-else-if="profile">
      <UCard>
        <template #header><h2 class="font-semibold text-body-strong">Dados pessoais</h2></template>
        <div class="grid gap-4 sm:grid-cols-2">
          <div v-for="item in [
            ['Nome', profile.user.name], ['CPF', profile.user.cpf], ['E-mail', profile.user.email],
            ['Telefone', profile.user.phone], ['Nascimento', profile.user.birth_date],
            ['Endereço', `${profile.user.address || ''}, ${profile.user.house_number || ''} — ${profile.user.address_city || ''}/${profile.user.address_state || ''}`],
          ]" :key="String(item[0])">
            <p class="text-xs uppercase text-body-muted">{{ item[0] }}</p><p class="font-medium text-body-strong">{{ item[1] || 'Não informado' }}</p>
          </div>
        </div>
      </UCard>

      <UCard id="ficha-saude">
        <template #header><div><h2 class="font-semibold text-body-strong">Ficha de saúde</h2><p class="text-sm text-body-muted">Informações opcionais usadas no atendimento humano.</p></div></template>
        <div class="grid gap-5 sm:grid-cols-2">
          <UFormField label="Tipo sanguíneo"><USelect v-model="health.blood_type" :items="bloodTypes" placeholder="Selecione" class="w-full" /></UFormField>
          <UFormField label="Alergias"><UTextarea v-model="health.allergies" :rows="3" class="w-full" /></UFormField>
          <UFormField label="Comorbidades"><UTextarea v-model="health.comorbidities" :rows="3" class="w-full" /></UFormField>
          <UFormField label="Medicamentos de uso contínuo"><UTextarea v-model="health.continuous_medications" :rows="3" class="w-full" /></UFormField>
        </div>
        <UAlert v-if="saved" class="mt-4" color="success" variant="soft" description="Ficha de saúde atualizada." />
        <UAlert v-if="error" class="mt-4" color="error" variant="soft" :description="error" />
        <div class="mt-5 flex justify-end"><UButton label="Salvar ficha de saúde" :loading="saving" @click="saveHealth" /></div>
      </UCard>

      <UCard>
        <template #header><div><h2 class="font-semibold text-body-strong">Consentimentos</h2><p class="text-sm text-body-muted">Histórico versionado das autorizações fornecidas.</p></div></template>
        <div class="divide-y divide-gray-200 dark:divide-white/10">
          <div v-for="consent in consents" :key="consent.id" class="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div><p class="font-medium text-body-strong">{{ consent.consent_type === 'platform_terms' ? 'Termos da plataforma' : 'Privacidade e dados de saúde' }}</p><p class="text-xs text-body-muted">Versão {{ consent.policy_version }} · {{ new Date(consent.granted_at).toLocaleString('pt-BR') }}</p></div>
            <UBadge v-if="consent.revoked_at" label="Revogado" color="neutral" variant="soft" />
            <UButton v-else label="Revogar" color="error" variant="ghost" size="sm" @click="revoke(consent)" />
          </div>
        </div>
      </UCard>
    </template>
  </div>
</template>
