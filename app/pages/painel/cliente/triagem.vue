<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface Symptom {
  id: string
  code: string
  label: string
  severity: 'normal' | 'warning' | 'emergency'
  guidance: string | null
}
interface TriageResult {
  emergency: boolean
  guidance: string[]
  disclaimer: string
  consultation: { id: string } | null
  quote: { coveredByPlan: boolean; price: number | null; planTitle: string | null } | null
}

const route = useRoute()
const { api } = useApi()
const { activeProfile, loadProfiles, selectProfile } = usePatientProfile()
const step = ref<'selection' | 'review' | 'result'>('selection')
const symptoms = ref<Symptom[]>([])
const selected = ref<string[]>([])
const description = ref('')
const triageId = ref('')
const pending = ref(true)
const completing = ref(false)
const error = ref('')
const result = ref<TriageResult | null>(null)

const kind = computed(() => activeProfile.value.kind === 'veterinaria' ? 'veterinario' : 'humano')
const selectedSymptoms = computed(() => symptoms.value.filter(item => selected.value.includes(item.id)))
const severeSymptoms = computed(() => selectedSymptoms.value.filter(item => item.severity === 'emergency'))
const warningSymptoms = computed(() => selectedSymptoms.value.filter(item => item.severity === 'warning'))
const canContinue = computed(() => selected.value.length >= 2 && selected.value.length <= 3)

function toggleSymptom(id: string) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(item => item !== id)
    return
  }
  if (selected.value.length < 3) selected.value.push(id)
}

async function initialize() {
  pending.value = true
  error.value = ''
  try {
    await loadProfiles()
    if (typeof route.query.pet === 'string') selectProfile(`pet:${route.query.pet}`)
    else if (typeof route.query.dependente === 'string') selectProfile(`dependent:${route.query.dependente}`)
    else if (route.query.tipo === 'humana') selectProfile('human')
    if (kind.value === 'veterinario' && !activeProfile.value.petId) {
      await navigateTo('/painel/cliente/pets')
      return
    }
    const [catalog, triage] = await Promise.all([
      api<Symptom[]>(`/patient/triage/symptoms?kind=${kind.value}`),
      api<{ id: string }>('/patient/triages', {
        method: 'POST',
        body: {
          kind: kind.value,
          pet_id: activeProfile.value.petId,
          dependent_id: activeProfile.value.dependentId,
        },
      }),
    ])
    symptoms.value = catalog
    triageId.value = triage.id
  } catch (err) {
    error.value = (err as { data?: { error?: string } }).data?.error || 'Não foi possível iniciar a triagem.'
  } finally { pending.value = false }
}

async function complete() {
  if (!canContinue.value || !triageId.value) return
  completing.value = true
  error.value = ''
  try {
    result.value = await api<TriageResult>(`/patient/triages/${triageId.value}/complete`, {
      method: 'POST',
      body: { symptom_ids: selected.value, description: description.value },
    })
    step.value = 'result'
  } catch (err) {
    error.value = (err as { data?: { error?: string } }).data?.error || 'Não foi possível concluir a triagem.'
  } finally { completing.value = false }
}

function formatPrice(value: number | null) {
  return value === 0 ? 'Incluído no plano' : Number(value ?? 99.9).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(initialize)
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <header>
      <p class="text-sm font-semibold text-[var(--portal-accent)]">Pronto atendimento · Triagem rápida</p>
      <h1 class="mt-1 text-2xl font-bold text-body-strong">{{ kind === 'humano' ? 'Conte como você está se sentindo' : `Conte como ${activeProfile.label} está` }}</h1>
      <p class="mt-2 text-sm text-body-muted">Esta etapa ajuda a organizar o atendimento, mas não substitui avaliação profissional e não oferece diagnóstico.</p>
    </header>

    <div class="flex items-center gap-3" aria-label="Progresso da triagem">
      <template v-for="(label, index) in ['Sintomas', 'Revisão', 'Orientação']" :key="label">
        <span class="flex size-8 items-center justify-center rounded-full text-sm font-bold" :class="(['selection', 'review', 'result'].indexOf(step) >= index) ? 'bg-[var(--portal-accent)] text-white' : 'bg-gray-200 text-gray-500 dark:bg-white/10'">{{ index + 1 }}</span>
        <span v-if="index < 2" class="h-px flex-1 bg-gray-200 dark:bg-white/10" />
      </template>
    </div>

    <UAlert v-if="error" color="error" variant="soft" :description="error" />
    <USkeleton v-if="pending" class="h-96 rounded-2xl" />

    <UCard v-else-if="step === 'selection'">
      <template #header><div><h2 class="font-bold text-body-strong">Selecione de 2 a 3 sintomas principais</h2><p class="text-sm text-body-muted">{{ selected.length }} de 3 selecionados</p></div></template>
      <div class="grid gap-3 sm:grid-cols-2">
        <button v-for="item in symptoms" :key="item.id" type="button" class="flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left transition" :class="selected.includes(item.id) ? 'border-[var(--portal-accent)] bg-blue-50/60 dark:bg-blue-500/10' : 'border-gray-200 hover:border-gray-400 dark:border-white/10'" @click="toggleSymptom(item.id)">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-full border" :class="selected.includes(item.id) ? 'border-[var(--portal-accent)] bg-[var(--portal-accent)] text-white' : 'border-gray-300'"><UIcon v-if="selected.includes(item.id)" name="i-heroicons-check" class="size-4" /></span>
          <span class="font-medium text-body-strong">{{ item.label }}</span>
          <UIcon v-if="item.severity === 'emergency'" name="i-heroicons-exclamation-triangle" class="ml-auto size-5 text-red-600" />
        </button>
      </div>
      <UAlert v-if="severeSymptoms.length" class="mt-5" color="error" variant="soft" title="Sinal de possível gravidade" description="Este sintoma pode exigir atendimento presencial imediato. Você receberá a orientação completa antes de concluir." />
      <UAlert v-else-if="warningSymptoms.length" class="mt-5" color="warning" variant="soft" title="Atenção necessária" description="Informe detalhes na próxima etapa para ajudar o profissional." />
      <div class="mt-6 flex justify-end"><UButton label="Revisar informações" icon="i-heroicons-arrow-right" trailing :disabled="!canContinue" @click="step = 'review'" /></div>
    </UCard>

    <UCard v-else-if="step === 'review'">
      <template #header><div><h2 class="font-bold text-body-strong">Revise antes de concluir</h2><p class="text-sm text-body-muted">Paciente: {{ activeProfile.label }} · Contexto {{ kind === 'humano' ? 'humano' : 'veterinário' }}</p></div></template>
      <div class="space-y-5">
        <div><p class="mb-2 text-sm font-semibold text-body-strong">Sintomas selecionados</p><div class="flex flex-wrap gap-2"><UBadge v-for="item in selectedSymptoms" :key="item.id" :label="item.label" variant="soft" color="info" /></div></div>
        <UFormField label="Descrição complementar (opcional)"><UTextarea v-model="description" :rows="5" class="w-full" placeholder="Quando começou? Houve piora? Há alguma informação importante?" /></UFormField>
        <UAlert color="neutral" variant="soft" icon="i-heroicons-information-circle" description="A triagem é orientativa, não constitui diagnóstico e não substitui atendimento presencial quando houver sinais de gravidade." />
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><UButton label="Voltar e editar" variant="outline" @click="step = 'selection'" /><UButton label="Concluir triagem" :loading="completing" @click="complete" /></div>
      </div>
    </UCard>

    <UCard v-else-if="result">
      <div class="py-4 text-center">
        <span class="mx-auto flex size-16 items-center justify-center rounded-full" :class="result.emergency ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'"><UIcon :name="result.emergency ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-check-circle'" class="size-9" /></span>
        <h2 class="mt-4 text-xl font-bold text-body-strong">{{ result.emergency ? 'Procure atendimento presencial imediatamente' : 'Triagem concluída' }}</h2>
        <p class="mx-auto mt-2 max-w-xl text-sm text-body-muted">{{ result.emergency ? 'Os sinais informados podem exigir recursos que a telemedicina não oferece. A solicitação online não foi colocada em fila.' : 'Sua solicitação de pronto atendimento foi registrada para o perfil selecionado.' }}</p>
      </div>
      <div v-if="result.guidance.length" class="space-y-2 rounded-xl bg-gray-50 p-4 dark:bg-white/5"><p v-for="guidance in result.guidance" :key="guidance" class="text-sm font-medium text-body-strong">{{ guidance }}</p></div>
      <div v-if="result.quote" class="mt-4 flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-white/10"><span class="text-sm text-body-muted">Valor do atendimento</span><strong class="text-body-strong">{{ formatPrice(result.quote.price) }}</strong></div>
      <UAlert class="mt-4" color="neutral" variant="soft" :description="result.disclaimer" />
      <div class="mt-5 flex justify-center"><UButton :to="result.emergency ? '/painel/cliente' : '/painel/cliente/consultas'" :label="result.emergency ? 'Voltar ao painel' : 'Acompanhar solicitação'" /></div>
    </UCard>
  </div>
</template>
