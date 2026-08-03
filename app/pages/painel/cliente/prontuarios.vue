<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface ClinicalRecord {
  id: string
  kind: 'humano' | 'veterinario'
  pet_id: string | null
  pet_name?: string | null
  blood_type?: string | null
  allergies?: string | null
  comorbidities?: string | null
  continuous_medications?: string | null
}

const { api } = useApi()
const { activeProfile, loadProfiles } = usePatientProfile()
const records = ref<ClinicalRecord[]>([])
const pending = ref(true)
const record = computed(() => records.value.find(item =>
  activeProfile.value.kind === 'humana'
    ? item.kind === 'humano' && !item.pet_id
    : item.kind === 'veterinario' && item.pet_id === activeProfile.value.petId,
))

onMounted(async () => {
  await loadProfiles()
  try {
    records.value = await api<ClinicalRecord[]>('/patient/records')
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Prontuário</h1><p class="text-sm text-body-muted">Dados clínicos de {{ activeProfile.label }}.</p></div>
    <USkeleton v-if="pending" class="h-56 rounded-xl" />
    <UCard v-else-if="record">
      <div class="grid gap-5 sm:grid-cols-2">
        <div><p class="text-xs uppercase text-body-muted">Tipo</p><p class="font-medium text-body-strong">{{ record.kind === 'humano' ? 'Humano' : 'Veterinário' }}</p></div>
        <div><p class="text-xs uppercase text-body-muted">Tipo sanguíneo</p><p class="font-medium text-body-strong">{{ record.blood_type || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase text-body-muted">Alergias</p><p class="font-medium text-body-strong">{{ record.allergies || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase text-body-muted">Comorbidades</p><p class="font-medium text-body-strong">{{ record.comorbidities || 'Não informado' }}</p></div>
        <div class="sm:col-span-2"><p class="text-xs uppercase text-body-muted">Medicamentos contínuos</p><p class="font-medium text-body-strong">{{ record.continuous_medications || 'Não informado' }}</p></div>
      </div>
    </UCard>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhum prontuário encontrado para este perfil.</div></UCard>
  </div>
</template>
