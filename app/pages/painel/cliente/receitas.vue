<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface Prescription {
  id: string
  kind: 'humana' | 'veterinaria'
  pet_id: string | null
  dependent_id?: string | null
  dependent_name?: string | null
  pet_name?: string | null
  content: string
  date: string
  professional_name?: string | null
}

const { api } = useApi()
const { activeProfile, loadProfiles } = usePatientProfile()
const prescriptions = ref<Prescription[]>([])
const pending = ref(true)
const visible = computed(() => prescriptions.value.filter(item =>
  activeProfile.value.kind === 'humana'
    ? item.kind === 'humana' && !item.pet_id && (activeProfile.value.dependentId
      ? item.dependent_id === activeProfile.value.dependentId
      : !item.dependent_id)
    : item.kind === 'veterinaria' && item.pet_id === activeProfile.value.petId,
))

onMounted(async () => {
  await loadProfiles()
  try {
    prescriptions.value = await api<Prescription[]>('/patient/prescriptions')
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Receitas</h1><p class="text-sm text-body-muted">Prescrições de {{ activeProfile.label }}.</p></div>
    <USkeleton v-if="pending" class="h-40 rounded-xl" />
    <div v-else-if="visible.length" class="grid gap-4 md:grid-cols-2">
      <UCard v-for="item in visible" :key="item.id">
        <p class="font-semibold text-body-strong">{{ item.kind === 'humana' ? 'Receita humana' : `Receita veterinária · ${item.pet_name}` }}</p>
        <p class="mt-2 line-clamp-3 whitespace-pre-line text-sm text-body-muted">{{ item.content }}</p>
        <p class="mt-4 text-xs text-body-muted">{{ new Date(`${item.date.slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR') }} · {{ item.professional_name || 'Profissional' }}</p>
      </UCard>
    </div>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhuma receita encontrada para este perfil.</div></UCard>
  </div>
</template>
