<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface ClinicalRecord {
  id: string
  kind: 'humano' | 'veterinario'
  pet_id: string | null
  dependent_id?: string | null
  blood_type?: string | null
  allergies?: string | null
  comorbidities?: string | null
  continuous_medications?: string | null
}
interface TimelineEvent {
  id: string
  type: 'consulta' | 'receita' | 'exame'
  title: string
  occurred_at: string
  time?: string
  status?: string
  notes?: string | null
  content?: string
  instructions?: string | null
  result_url?: string | null
  professional_name?: string | null
}
interface TimelineResponse {
  items: TimelineEvent[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

const { api } = useApi()
const { activeProfile, loadProfiles } = usePatientProfile()
const records = ref<ClinicalRecord[]>([])
const timeline = ref<TimelineResponse>({ items: [], page: 1, page_size: 10, total: 0, total_pages: 0 })
const pendingRecord = ref(true)
const pendingTimeline = ref(true)
const error = ref('')
const filters = reactive({ type: 'todos', from: '', to: '', page: 1 })
const typeOptions = [
  { label: 'Todos os eventos', value: 'todos' },
  { label: 'Consultas', value: 'consulta' },
  { label: 'Receitas', value: 'receita' },
  { label: 'Exames', value: 'exame' },
]

const record = computed(() => records.value.find(item =>
  activeProfile.value.kind === 'humana'
    ? item.kind === 'humano' && !item.pet_id && (activeProfile.value.dependentId
      ? item.dependent_id === activeProfile.value.dependentId
      : !item.dependent_id)
    : item.kind === 'veterinario' && item.pet_id === activeProfile.value.petId,
))

async function loadTimeline() {
  pendingTimeline.value = true
  error.value = ''
  const params = new URLSearchParams({
    kind: activeProfile.value.kind === 'humana' ? 'humano' : 'veterinario',
    type: filters.type,
    page: String(filters.page),
    page_size: '10',
  })
  if (activeProfile.value.petId) params.set('pet_id', activeProfile.value.petId)
  if (activeProfile.value.dependentId) params.set('dependent_id', activeProfile.value.dependentId)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  try {
    timeline.value = await api<TimelineResponse>(`/patient/timeline?${params}`)
  } catch (err) {
    error.value = (err as { data?: { error?: string } }).data?.error || 'Não foi possível carregar o histórico.'
  } finally { pendingTimeline.value = false }
}

function applyFilters() {
  filters.page = 1
  loadTimeline()
}
function clearFilters() {
  Object.assign(filters, { type: 'todos', from: '', to: '', page: 1 })
  loadTimeline()
}
function changePage(page: number) {
  filters.page = page
  loadTimeline()
}
function formatDate(value: string) {
  return new Date(value.length === 10 ? `${value}T12:00:00` : value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
function eventMeta(item: TimelineEvent) {
  if (item.type === 'consulta') return { icon: 'i-mdi-stethoscope', color: 'bg-blue-100 text-blue-700' }
  if (item.type === 'receita') return { icon: 'i-heroicons-document-text', color: 'bg-emerald-100 text-emerald-700' }
  return { icon: 'i-heroicons-beaker', color: 'bg-violet-100 text-violet-700' }
}
function statusLabel(value?: string) {
  const labels: Record<string, string> = {
    agendada: 'Agendada', confirmada: 'Confirmada', realizada: 'Realizada', cancelada: 'Cancelada',
    solicitado: 'Solicitado', agendado: 'Agendado', coletado: 'Coletado', disponivel: 'Disponível',
  }
  return value ? labels[value] || value : ''
}

watch(() => activeProfile.value.key, () => {
  filters.page = 1
  loadTimeline()
})

onMounted(async () => {
  await loadProfiles()
  try {
    records.value = await api<ClinicalRecord[]>('/patient/records')
  } finally { pendingRecord.value = false }
  await loadTimeline()
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <header>
      <p class="text-sm font-semibold text-[var(--portal-accent)]">Histórico clínico</p>
      <h1 class="mt-1 text-2xl font-bold text-body-strong">Prontuário de {{ activeProfile.label }}</h1>
      <p class="mt-1 text-sm text-body-muted">Consultas, evoluções compartilhadas, receitas e exames do perfil selecionado.</p>
    </header>

    <USkeleton v-if="pendingRecord" class="h-32 rounded-2xl" />
    <UCard v-else-if="record">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><p class="text-xs uppercase tracking-wide text-body-muted">Tipo sanguíneo</p><p class="mt-1 font-medium text-body-strong">{{ record.blood_type || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase tracking-wide text-body-muted">Alergias</p><p class="mt-1 font-medium text-body-strong">{{ record.allergies || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase tracking-wide text-body-muted">Comorbidades</p><p class="mt-1 font-medium text-body-strong">{{ record.comorbidities || 'Não informado' }}</p></div>
        <div><p class="text-xs uppercase tracking-wide text-body-muted">Uso contínuo</p><p class="mt-1 font-medium text-body-strong">{{ record.continuous_medications || 'Não informado' }}</p></div>
      </div>
    </UCard>

    <UCard>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
        <UFormField label="Tipo de evento"><USelect v-model="filters.type" :items="typeOptions" class="w-full" /></UFormField>
        <UFormField label="De"><UInput v-model="filters.from" type="date" class="w-full" /></UFormField>
        <UFormField label="Até"><UInput v-model="filters.to" type="date" class="w-full" /></UFormField>
        <div class="flex gap-2"><UButton label="Filtrar" icon="i-heroicons-funnel" @click="applyFilters" /><UButton icon="i-heroicons-x-mark" variant="ghost" aria-label="Limpar filtros" @click="clearFilters" /></div>
      </div>
    </UCard>

    <UAlert v-if="error" color="error" variant="soft" :description="error" />
    <div v-if="pendingTimeline" class="space-y-4"><USkeleton v-for="n in 3" :key="n" class="h-32 rounded-2xl" /></div>
    <section v-else-if="timeline.items.length" class="relative space-y-4 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-gray-200">
      <article v-for="item in timeline.items" :key="`${item.type}:${item.id}`" class="relative flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <span class="z-10 flex size-12 shrink-0 items-center justify-center rounded-full ring-4 ring-gray-50" :class="eventMeta(item).color"><UIcon :name="eventMeta(item).icon" class="size-6" /></span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div><p class="text-xs font-semibold uppercase tracking-wide text-[var(--portal-accent)]">{{ item.type }}</p><h2 class="font-bold text-body-strong">{{ item.title }}</h2></div>
            <div class="text-right"><p class="text-sm font-medium text-body-strong">{{ formatDate(item.occurred_at) }}</p><p v-if="item.time" class="text-xs text-body-muted">{{ item.time.slice(0, 5) }}</p></div>
          </div>
          <p v-if="item.professional_name" class="mt-2 text-sm text-body-muted">Profissional: {{ item.professional_name }}</p>
          <UBadge v-if="item.status" :label="statusLabel(item.status)" variant="soft" color="info" class="mt-2" />
          <div v-if="item.notes" class="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-body-muted"><strong class="mb-1 block text-body-strong">Evolução compartilhada</strong>{{ item.notes }}</div>
          <div v-if="item.content" class="mt-3 whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm text-body-muted">{{ item.content }}</div>
          <p v-if="item.instructions" class="mt-3 text-sm text-body-muted">{{ item.instructions }}</p>
          <UButton v-if="item.result_url" :to="item.result_url" target="_blank" label="Ver resultado" icon="i-heroicons-arrow-down-tray" variant="outline" size="sm" class="mt-3" />
        </div>
      </article>
    </section>
    <UCard v-else>
      <div class="py-12 text-center"><UIcon name="i-heroicons-clock" class="mx-auto size-12 text-body-muted" /><h2 class="mt-3 font-semibold text-body-strong">Nenhum evento encontrado</h2><p class="mt-1 text-sm text-body-muted">{{ filters.type === 'todos' && !filters.from && !filters.to ? 'O histórico deste perfil aparecerá aqui após os atendimentos.' : 'Tente remover ou alterar os filtros aplicados.' }}</p><UButton v-if="filters.type !== 'todos' || filters.from || filters.to" label="Limpar filtros" variant="outline" class="mt-4" @click="clearFilters" /></div>
    </UCard>

    <footer v-if="timeline.total_pages > 1" class="flex items-center justify-between gap-4">
      <p class="text-sm text-body-muted">{{ timeline.total }} eventos · Página {{ timeline.page }} de {{ timeline.total_pages }}</p>
      <div class="flex gap-2"><UButton icon="i-heroicons-chevron-left" variant="outline" :disabled="timeline.page <= 1" aria-label="Página anterior" @click="changePage(timeline.page - 1)" /><UButton icon="i-heroicons-chevron-right" variant="outline" :disabled="timeline.page >= timeline.total_pages" aria-label="Próxima página" @click="changePage(timeline.page + 1)" /></div>
    </footer>
  </div>
</template>
