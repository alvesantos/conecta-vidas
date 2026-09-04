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
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Fortaleza' })
const time = ref('')
const specialtyId = ref('')
const slotKey = ref('')
const notes = ref('')
const pending = ref(false)
interface Quote {
  hasActivePlan: boolean
  planTitle: string | null
  remainingFree: number
  coveredByPlan: boolean
  price: number | null
  priceConfigured: boolean
}
const quote = ref<Quote | null>(null)
const quotePending = ref(false)
interface Specialty { id: string; name: string }
interface Slot { professional_id: string; professional_name: string; time: string }
const specialties = ref<Specialty[]>([])
const slots = ref<Slot[]>([])
const slotsPending = ref(false)
const specialtyOptions = computed(() => specialties.value.map(item => ({ label: item.name, value: item.id })))
const slotOptions = computed(() => slots.value.map(item => ({ label: `${item.time} · ${item.professional_name}`, value: `${item.professional_id}|${item.time}` })))




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
  specialtyId.value = ''
  slotKey.value = ''
  void loadSpecialties()
}

async function loadSpecialties() {
  specialties.value = await api<Specialty[]>(`/scheduling/specialties?kind=${kind.value}`)
}
async function loadSlots() {
  slots.value = []
  slotKey.value = ''
  if (!specialtyId.value || !date.value) return
  slotsPending.value = true
  try { slots.value = await api<Slot[]>(`/scheduling/slots?specialty_id=${specialtyId.value}&date=${date.value}`) } finally { slotsPending.value = false }
}

async function loadQuote() {
  quotePending.value = true
  try {
    quote.value = await api<Quote>(`/consultations/quote?kind=${kind.value}&care_mode=especialista`)
  } finally { quotePending.value = false }
}

watch(petId, value => {
  if (value) selectProfile(`pet:${value}`)
})
watch(dependentId, value => {
  if (kind.value === 'humana') selectProfile(value ? `dependent:${value}` : 'human')
})
watch(kind, loadQuote)
watch([specialtyId, date], loadSlots)

onMounted(async () => {
  await loadProfiles()
  selectKind(kind.value)
  await loadQuote()
  await loadSpecialties()
})

async function submit() {
  if (!date.value) {
    toast.add({ title: 'Preencha a data', color: 'warning' })
    return
  }
  if (!specialtyId.value || !slotKey.value) {
    toast.add({ title: 'Selecione especialidade e horário disponível', color: 'warning' })
    return
  }
  if (kind.value === 'veterinaria' && !petId.value) {
    toast.add({ title: 'Selecione o pet que será atendido', color: 'warning' })
    return
  }

  pending.value = true
  try {
    const [professionalId, selectedTime] = slotKey.value.split('|')
    await api('/consultations', {
      method: 'POST',
      body: {
        kind: kind.value,
        pet_id: kind.value === 'veterinaria' ? petId.value : null,
        dependent_id: kind.value === 'humana' ? dependentId.value || null : null,
        date: date.value,
        time: selectedTime || time.value,
        specialty_id: specialtyId.value,
        professional_id: professionalId,
        notes: notes.value,
      },
    })
    toast.add({
      title: 'Consulta agendada',
      description: 'Sua solicitação foi enviada.',
      color: 'success',
    })
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
      <p class="text-sm font-medium text-[var(--portal-accent)]">Atendimento especializado</p>
      <h1 class="mt-1 text-2xl font-bold text-body-strong sm:text-3xl">Agendar especialista</h1>
      <p class="mt-2 text-sm text-body-muted">Escolha a especialidade, a data e um horário disponível do profissional.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        class="group rounded-2xl border-2 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        :class="kind === 'humana' ? 'border-[var(--portal-accent)] shadow-sm' : 'border-gray-200'"
        @click="selectKind('humana')"
      >
        <span class="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><UIcon name="i-mdi-doctor" class="size-7" /></span>
        <span class="mt-4 block text-lg font-semibold text-body-strong">Humano</span>
        <span class="mt-1 block text-sm text-body-muted">Consulta médica para você.</span>
      </button>
      <button
        type="button"
        class="group rounded-2xl border-2 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        :class="kind === 'veterinaria' ? 'border-[var(--portal-accent)] shadow-sm' : 'border-gray-200'"
        @click="selectKind('veterinaria')"
      >
        <span class="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><UIcon name="i-mdi-paw" class="size-7" /></span>
        <span class="mt-4 block text-lg font-semibold text-body-strong">Pet</span>
        <span class="mt-1 block text-sm text-body-muted">Consulta veterinária para seu pet.</span>
      </button>
    </div>

    <UAlert
      v-if="kind === 'veterinaria' && pets.length === 0"
      title="Cadastre um pet para continuar"
      description="O atendimento veterinário precisa ser vinculado ao pet."
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
        <UFormField v-if="kind === 'veterinaria'" label="Pet *">
          <USelect v-model="petId" :items="petOptions" placeholder="Selecione o pet" class="w-full" size="lg" />
        </UFormField>
        <div class="space-y-4">
          <UFormField label="Especialidade *"><USelect v-model="specialtyId" :items="specialtyOptions" placeholder="Selecione a especialidade" class="w-full" size="lg" /></UFormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="Data *"><UInput v-model="date" type="date" :min="today" required class="w-full" size="lg" /></UFormField>
            <UFormField label="Horário e profissional *"><USelect v-model="slotKey" :items="slotOptions" :loading="slotsPending" :disabled="!specialtyId || !date" :placeholder="slots.length ? 'Selecione um horário' : 'Nenhum horário disponível'" class="w-full" size="lg" /></UFormField>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 p-4">
          <div v-if="quotePending" class="flex items-center gap-2 text-sm text-body-muted"><UIcon name="i-heroicons-arrow-path" class="size-5 animate-spin" /> Verificando cobertura...</div>
          <template v-else-if="quote">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-body-muted">Cobertura</p>
                <p class="font-semibold text-body-strong">{{ quote.coveredByPlan ? `Incluído no plano ${quote.planTitle || ''}` : quote.hasActivePlan ? 'Cota mensal utilizada' : 'Atendimento avulso' }}</p>
                <p v-if="quote.hasActivePlan" class="mt-1 text-xs text-body-muted">{{ quote.remainingFree }} atendimento(s) incluído(s) restante(s) neste mês.</p>
              </div>
              <div class="text-right">
                <p class="text-xs uppercase tracking-wide text-body-muted">Valor</p>
                <p v-if="quote.priceConfigured" class="text-xl font-bold text-body-strong">{{ quote.price === 0 ? 'Incluído' : Number(quote.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>
                <p v-else class="font-semibold text-amber-700">A confirmar</p>
              </div>
            </div>
            <UAlert v-if="!quote.priceConfigured" class="mt-3" color="warning" variant="soft" description="O valor avulso ainda depende da configuração comercial. A equipe confirmará antes de qualquer cobrança." />
          </template>
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
