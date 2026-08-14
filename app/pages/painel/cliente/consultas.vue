<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface Consultation {
  id: string
  date: string
  time: string
  status: string
  kind: 'humana' | 'veterinaria'
  pet_id?: string | null
  dependent_id?: string | null
  dependent_name?: string | null
  pet_name?: string | null
  vet_name?: string | null
  care_mode?: 'pronto' | 'especialista'
  specialty_id?: string | null
  specialty_name?: string | null
}

const { api } = useApi()
const { activeProfile, loadProfiles } = usePatientProfile()
const consultations = ref<Consultation[]>([])
const pending = ref(true)

const visible = computed(() => consultations.value.filter(item =>
  activeProfile.value.kind === 'humana'
    ? item.kind === 'humana' && !item.pet_id && (activeProfile.value.dependentId
      ? item.dependent_id === activeProfile.value.dependentId
      : !item.dependent_id)
    : item.kind === 'veterinaria' && item.pet_id === activeProfile.value.petId,
))

onMounted(async () => {
  await loadProfiles()
  try {
    consultations.value = await api<Consultation[]>('/consultations')
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-body-strong">Minhas consultas</h1>
      <p class="text-sm text-body-muted">Atendimentos de {{ activeProfile.label }}.</p>
    </div>
    <USkeleton v-if="pending" class="h-40 rounded-xl" />
    <div v-else-if="visible.length" class="space-y-3">
      <UCard v-for="item in visible" :key="item.id">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="font-semibold text-body-strong">{{ item.kind === 'humana' ? `Consulta humana${item.dependent_name ? ` · ${item.dependent_name}` : ''}` : `Consulta veterinária · ${item.pet_name}` }}</p>
            <p v-if="item.specialty_name" class="mt-1 text-sm font-medium text-body-strong">{{ item.specialty_name }}</p>
            <p class="mt-1 text-sm text-body-muted">{{ new Date(`${item.date.slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR') }} às {{ item.time.slice(0, 5) }} · {{ item.vet_name || 'Profissional a definir' }}</p>
          </div>
          <UBadge :label="item.status" variant="soft" />
          <UButton
            v-if="item.care_mode === 'pronto' && !['cancelada', 'realizada'].includes(item.status)"
            :to="`/painel/cliente/fila/${item.id}`"
            :label="item.status === 'confirmada' ? 'Abrir atendimento' : 'Voltar à sala de espera'"
            variant="outline"
            size="sm"
          />
          <UButton
            v-if="item.care_mode === 'especialista' && item.specialty_id && !['cancelada', 'realizada'].includes(item.status)"
            :to="`/painel/cliente/consultas/${item.id}/reagendar`"
            label="Reagendar"
            variant="outline"
            size="sm"
          />
          <UButton
            v-if="item.status === 'confirmada' && item.vet_name"
            :to="`/painel/cliente/atendimento/${item.id}`"
            label="Entrar na consulta"
            icon="i-heroicons-video-camera"
            size="sm"
          />
        </div>
      </UCard>
    </div>
    <UCard v-else><div class="py-10 text-center text-body-muted">Nenhuma consulta encontrada para este perfil.</div></UCard>
  </div>
</template>
