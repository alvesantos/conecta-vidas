<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

const route = useRoute()
const router = useRouter()
const { api } = useApi()
const toast = useToast()
const { pets, dependents, activeProfile, loadProfiles, selectProfile } = usePatientProfile()

const kind = ref<'humana' | 'veterinaria'>(route.query.tipo === 'veterinaria' ? 'veterinaria' : 'humana')
const petId = ref(typeof route.query.pet === 'string' ? route.query.pet : '')
const dependentId = ref(typeof route.query.dependente === 'string' ? route.query.dependente : '')
const date = ref('')
const time = ref('')
const notes = ref('')
const pending = ref(false)

const petOptions = computed(() => pets.value.map(pet => ({
  label: `${pet.name} · ${pet.breed}`,
  value: pet.id,
})))
const humanOptions = computed(() => [
  { label: 'Titular da conta', value: 'titular' },
  ...dependents.value.map(dependent => ({
    label: `${dependent.name} · ${dependent.relationship}`,
    value: dependent.id,
  })),
])

function selectKind(value: 'humana' | 'veterinaria') {
  kind.value = value
  if (value === 'humana') {
    petId.value = ''
    if (!dependentId.value && activeProfile.value.kind === 'humana' && activeProfile.value.dependentId) {
      dependentId.value = activeProfile.value.dependentId
    }
    selectProfile(dependentId.value ? `dependent:${dependentId.value}` : 'human')
  } else if (!petId.value && activeProfile.value.kind === 'veterinaria') {
    petId.value = activeProfile.value.petId
  } else if (!petId.value && pets.value.length === 1) {
    petId.value = pets.value[0]!.id
  }
}

watch(petId, value => {
  if (value) selectProfile(`pet:${value}`)
})
watch(dependentId, value => {
  if (kind.value === 'humana') selectProfile(value ? `dependent:${value}` : 'human')
})

onMounted(async () => {
  await loadProfiles()
  selectKind(kind.value)
})

async function submit() {
  if (!date.value || !time.value) {
    toast.add({ title: 'Preencha data e horário', color: 'warning' })
    return
  }
  if (kind.value === 'veterinaria' && !petId.value) {
    toast.add({ title: 'Selecione o animal que será atendido', color: 'warning' })
    return
  }

  pending.value = true
  try {
    await api('/consultations', {
      method: 'POST',
      body: {
        kind: kind.value,
        pet_id: kind.value === 'veterinaria' ? petId.value : null,
        dependent_id: kind.value === 'humana' ? dependentId.value || null : null,
        date: date.value,
        time: time.value,
        notes: notes.value,
      },
    })
    toast.add({ title: 'Consulta agendada', description: 'Sua solicitação foi enviada.', color: 'success' })
    await router.push('/painel/cliente/consultas')
  } catch (error: unknown) {
    toast.add({
      title: 'Não foi possível agendar',
      description: (error as { data?: { error?: string } }).data?.error ?? 'Tente novamente.',
      color: 'error',
    })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div>
      <p class="text-sm font-medium text-[var(--portal-accent)]">Novo atendimento</p>
      <h1 class="mt-1 text-2xl font-bold text-body-strong sm:text-3xl">Agendar consulta</h1>
      <p class="mt-2 text-sm text-body-muted">Escolha o tipo de cuidado e informe o melhor horário.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        class="group rounded-2xl border-2 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:bg-[#071b30]"
        :class="kind === 'humana' ? 'border-[var(--portal-accent)] shadow-sm' : 'border-gray-200 dark:border-white/10'"
        @click="selectKind('humana')"
      >
        <span class="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><UIcon name="i-mdi-doctor" class="size-7" /></span>
        <span class="mt-4 block text-lg font-semibold text-body-strong">Humano</span>
        <span class="mt-1 block text-sm text-body-muted">Consulta médica para você.</span>
      </button>
      <button
        type="button"
        class="group rounded-2xl border-2 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:bg-[#071b30]"
        :class="kind === 'veterinaria' ? 'border-[var(--portal-accent)] shadow-sm' : 'border-gray-200 dark:border-white/10'"
        @click="selectKind('veterinaria')"
      >
        <span class="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"><UIcon name="i-mdi-paw" class="size-7" /></span>
        <span class="mt-4 block text-lg font-semibold text-body-strong">Animal</span>
        <span class="mt-1 block text-sm text-body-muted">Consulta veterinária para seu pet.</span>
      </button>
    </div>

    <UAlert
      v-if="kind === 'veterinaria' && pets.length === 0"
      title="Cadastre um pet para continuar"
      description="O atendimento veterinário precisa ser vinculado ao animal."
      color="info"
      variant="soft"
      icon="i-mdi-paw-plus"
      :actions="[{ label: 'Cadastrar pet', to: '/painel/cliente/pets' }]"
    />

    <UCard v-else>
      <template #header>
        <div>
          <h2 class="font-semibold text-body-strong">{{ kind === 'humana' ? 'Consulta médica' : 'Consulta veterinária' }}</h2>
          <p class="text-sm text-body-muted">{{ kind === 'humana' ? 'Selecione quem será atendido' : 'Selecione qual pet será atendido' }}</p>
        </div>
      </template>
      <form class="space-y-5" @submit.prevent="submit">
        <UFormField v-if="kind === 'humana'" label="Paciente *">
          <USelect :model-value="dependentId || 'titular'" :items="humanOptions" class="w-full" size="lg" @update:model-value="dependentId = $event === 'titular' ? '' : String($event)" />
        </UFormField>
        <UFormField v-if="kind === 'veterinaria'" label="Animal *">
          <USelect v-model="petId" :items="petOptions" placeholder="Selecione o pet" class="w-full" size="lg" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Data *"><UInput v-model="date" type="date" required class="w-full" size="lg" /></UFormField>
          <UFormField label="Horário *"><UInput v-model="time" type="time" required class="w-full" size="lg" /></UFormField>
        </div>
        <UFormField label="Motivo da consulta">
          <UTextarea v-model="notes" :rows="5" class="w-full" placeholder="Descreva brevemente o que está acontecendo." />
        </UFormField>
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <UButton to="/painel/cliente" label="Cancelar" variant="outline" size="lg" class="justify-center" />
          <UButton type="submit" label="Confirmar agendamento" size="lg" class="justify-center" :loading="pending" />
        </div>
      </form>
    </UCard>
  </div>
</template>
