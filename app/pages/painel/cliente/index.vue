<script setup lang="ts">
import type { Subscription } from '~/interfaces/plans'

definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface Pet { id: string; name: string; species: string; breed: string }
interface Consultation {
  id: string
  date: string
  time: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  kind: 'humana' | 'veterinaria'
  pet_id?: string | null
  dependent_id?: string | null
}
interface MedicationReminder {
  id: string
  kind: 'humano' | 'veterinario'
  pet_id: string | null
  dependent_id: string | null
  name: string
  dosage: string | null
  instructions: string | null
  time: string
  active: boolean
}

const { user } = useAuth()
const { api } = useApi()
const { getMySubscription } = usePlans()
const { profiles, activeKey, activeProfile, loadProfiles, selectProfile } = usePatientProfile()
const { show: showConecta } = usePatientConecta()
const router = useRouter()

const pets = ref<Pet[]>([])
const consultations = ref<Consultation[]>([])
const reminders = ref<MedicationReminder[]>([])
const subscription = ref<Subscription | null>(null)
const pending = ref(true)
const errorMsg = ref('')
const reminderOpen = ref(false)
const savingReminder = ref(false)
const deletingReminder = ref('')
const reminderError = ref('')
const reminderForm = reactive({ name: '', dosage: '', time: '', instructions: '' })

const firstName = computed(() => user.value?.name?.trim().split(/\s+/)[0] || 'Cliente')
const veterinary = computed(() => activeProfile.value.kind === 'veterinaria')
const visibleConsultations = computed(() => consultations.value.filter(item =>
  veterinary.value
    ? item.kind === 'veterinaria' && item.pet_id === activeProfile.value.petId
    : item.kind === 'humana' && (activeProfile.value.dependentId
      ? item.dependent_id === activeProfile.value.dependentId
      : !item.dependent_id),
))
const upcomingConsultations = computed(() => {
  const now = new Date()
  return visibleConsultations.value
    .filter(item => !['cancelada', 'realizada'].includes(item.status))
    .filter(item => new Date(`${item.date.slice(0, 10)}T${item.time || '00:00'}`) >= now)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
})
const nextConsultation = computed(() => upcomingConsultations.value[0] || null)
const visibleReminders = computed(() => reminders.value.filter(item =>
  item.active && (veterinary.value
    ? item.kind === 'veterinario' && item.pet_id === activeProfile.value.petId
    : item.kind === 'humano' && (activeProfile.value.dependentId
      ? item.dependent_id === activeProfile.value.dependentId
      : !item.dependent_id)),
))

async function loadDashboard() {
  pending.value = true
  errorMsg.value = ''
  const results = await Promise.allSettled([
    api<Pet[]>('/pets/me'),
    api<Consultation[]>('/consultations'),
    api<MedicationReminder[]>('/patient/medication-reminders'),
    getMySubscription(),
    loadProfiles(),
  ])
  if (results[0].status === 'fulfilled') pets.value = results[0].value
  if (results[1].status === 'fulfilled') consultations.value = results[1].value
  if (results[2].status === 'fulfilled') reminders.value = results[2].value
  if (results[3].status === 'fulfilled') subscription.value = results[3].value
  if (results.some(result => result.status === 'rejected')) errorMsg.value = 'Algumas informações não puderam ser carregadas.'
  pending.value = false
}

function schedule(kind: 'humana' | 'veterinaria') {
  if (kind === 'veterinaria' && !pets.value.length) return router.push('/painel/cliente/pets')
  const pet = activeProfile.value.petId || pets.value[0]?.id
  router.push({
    path: '/painel/cliente/agendar',
    query: {
      tipo: kind,
      ...(kind === 'veterinaria' && pet ? { pet } : {}),
      ...(kind === 'humana' && activeProfile.value.dependentId ? { dependente: activeProfile.value.dependentId } : {}),
    },
  })
}

function openReminder() {
  Object.assign(reminderForm, { name: '', dosage: '', time: '', instructions: '' })
  reminderError.value = ''
  reminderOpen.value = true
}
async function saveReminder() {
  reminderError.value = ''
  if (!reminderForm.name.trim() || !reminderForm.time) {
    reminderError.value = 'Informe o medicamento e o horário.'
    return
  }
  savingReminder.value = true
  try {
    const created = await api<MedicationReminder>('/patient/medication-reminders', {
      method: 'POST',
      body: {
        ...reminderForm,
        kind: veterinary.value ? 'veterinario' : 'humano',
        pet_id: activeProfile.value.petId,
        dependent_id: activeProfile.value.dependentId,
      },
    })
    reminders.value.push(created)
    reminders.value.sort((a, b) => a.time.localeCompare(b.time))
    reminderOpen.value = false
  } catch (err) {
    reminderError.value = (err as { data?: { error?: string } }).data?.error || 'Erro ao salvar lembrete.'
  } finally { savingReminder.value = false }
}
async function removeReminder(item: MedicationReminder) {
  deletingReminder.value = item.id
  try {
    await api(`/patient/medication-reminders/${item.id}`, { method: 'DELETE' })
    reminders.value = reminders.value.filter(row => row.id !== item.id)
  } finally { deletingReminder.value = '' }
}

function formatDate(date: string) {
  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
}
function profileSubtitle(profile: (typeof profiles.value)[number]) {
  if (profile.key === 'human') return 'Titular · Humano'
  return profile.kind === 'humana' ? 'Dependente · Humano' : 'Pet · Veterinário'
}


function startQueue(kind: 'humana' | 'veterinaria') {
  if (kind === 'veterinaria' && !pets.value.length) return router.push('/painel/cliente/pets')
  const pet = activeProfile.value.petId || pets.value[0]?.id
  router.push({
    path: '/painel/cliente/triagem',
    query: {
      tipo: kind,
      atendimento: 'pronto',
      ...(kind === 'veterinaria' && pet ? { pet } : {}),
      ...(kind === 'humana' && activeProfile.value.dependentId ? { dependente: activeProfile.value.dependentId } : {}),
    },
  })
}

onMounted(loadDashboard)
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[var(--portal-accent)]">Portal do Cliente</p>
        <h1 class="mt-1 text-2xl font-bold text-body-strong sm:text-3xl">Olá, {{ firstName }}</h1>
        <p class="mt-1 text-sm text-body-muted">Cuidados de hoje para {{ activeProfile.label }}.</p>
      </div>
      
    </header>

    <UAlert v-if="errorMsg" color="warning" variant="soft" :description="errorMsg" />

    <section>
      <div class="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        <button v-for="profile in profiles" :key="profile.key" type="button" class="flex min-w-48 snap-start items-center gap-3 rounded-2xl border bg-white p-3 text-left transition" :class="activeKey === profile.key ? 'border-[var(--portal-accent)] shadow-sm' : 'border-gray-200'" @click="selectProfile(profile.key)">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--portal-accent)]"><UIcon :name="profile.kind === 'humana' ? 'i-heroicons-user' : 'i-mdi-paw'" class="size-5" /></span>
          <span class="min-w-0"><strong class="block truncate text-sm text-body-strong">{{ profile.label }}</strong><span class="block text-xs text-body-muted">{{ profileSubtitle(profile) }}</span></span>
          <UIcon v-if="activeKey === profile.key" name="i-heroicons-check-circle-solid" class="ml-auto size-5 text-[var(--portal-accent)]" />
        </button>
      </div>
    </section>

    
    <section class="rounded-2xl bg-[#01193A] p-5 text-white shadow-sm sm:p-6">
      <h2 class="text-xl font-bold sm:text-2xl">Solicite</h2>
      <p class="mt-1 text-sm font-medium text-white/70">Atendimentos rápidos ou agendamentos comuns.</p>
      <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        
        <button type="button" class="flex flex-col gap-2 rounded-xl bg-red-500 p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5 border border-red-400" @click="startQueue('humana')">
          <div class="flex w-full items-center justify-between"><UIcon name="i-heroicons-bolt" class="size-7" /><UIcon name="i-heroicons-arrow-right" class="size-5" /></div>
          <span><strong class="block text-lg">Pronto Atendimento para Humano (Urgente)</strong><span class="text-xs text-red-100">Um de nossos médicos irá se prontificar o quanto antes.</span></span>
        </button>

        <button v-if="pets.length > 0" type="button" class="flex flex-col gap-2 rounded-xl bg-orange-500 p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5 border border-orange-400" @click="startQueue('veterinaria')">
          <div class="flex w-full items-center justify-between"><UIcon name="i-mdi-paw" class="size-7" /><UIcon name="i-heroicons-arrow-right" class="size-5" /></div>
          <span><strong class="block text-lg">Pronto Atendimento para Animais (Urgente)</strong><span class="text-xs text-orange-100">Um veterinário irá se prontificar o quanto antes.</span></span>
        </button>

        <button type="button" class="flex flex-col gap-2 rounded-xl bg-white p-4 text-left text-[#01193A] transition hover:-translate-y-0.5" @click="schedule('humana')">
          <div class="flex w-full items-center justify-between"><UIcon name="i-mdi-doctor" class="size-7" /><UIcon name="i-heroicons-arrow-right" class="size-5" /></div>
          <span><strong class="block text-lg">Atendimento Humano</strong><span class="text-xs text-gray-500">Agendar consulta médica comum.</span></span>
        </button>

        <button v-if="pets.length > 0" type="button" class="flex flex-col gap-2 rounded-xl bg-white p-4 text-left text-[#01193A] transition hover:-translate-y-0.5" @click="schedule('veterinaria')">
          <div class="flex w-full items-center justify-between"><UIcon name="i-mdi-paw" class="size-7" /><UIcon name="i-heroicons-arrow-right" class="size-5" /></div>
          <span><strong class="block text-lg">Atendimento Veterinário</strong><span class="text-xs text-gray-500">Agendar consulta veterinária comum.</span></span>
        </button>

      </div>
    </section>


    <section v-if="pending" class="grid gap-4 lg:grid-cols-3"><USkeleton v-for="n in 3" :key="n" class="h-36 rounded-2xl" /></section>
    <section v-else class="grid gap-4 lg:grid-cols-3">
      <UCard class="lg:col-span-2">
        <template #header><div><p class="text-sm font-semibold text-[var(--portal-accent)]">Resumo do dia</p><h2 class="text-lg font-bold text-body-strong">O essencial para {{ activeProfile.label }}</h2></div></template>
        <div class="grid gap-3 sm:grid-cols-2">
          <NuxtLink to="/painel/cliente/consultas" class="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
            <span class="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><UIcon name="i-heroicons-calendar-days" class="size-6" /></span>
            <span v-if="nextConsultation"><span class="block text-xs text-body-muted">Próxima consulta</span><strong class="block text-body-strong">{{ formatDate(nextConsultation.date) }} · {{ nextConsultation.time.slice(0, 5) }}</strong></span>
            <span v-else><span class="block text-xs text-body-muted">Próxima consulta</span><strong class="block text-body-strong">Nenhuma agendada</strong></span>
          </NuxtLink>
          <button type="button" class="flex items-center gap-4 rounded-xl bg-gray-50 p-4 text-left" @click="openReminder">
            <span class="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><UIcon name="i-heroicons-bell-alert" class="size-6" /></span>
            <span><span class="block text-xs text-body-muted">Medicamentos hoje</span><strong class="block text-body-strong">{{ visibleReminders.length }} lembrete{{ visibleReminders.length === 1 ? '' : 's' }}</strong></span>
            <UIcon name="i-heroicons-plus" class="ml-auto size-5 text-body-muted" />
          </button>
        </div>
        <div v-if="visibleReminders.length" class="mt-4 divide-y divide-gray-200">
          <div v-for="item in visibleReminders" :key="item.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <strong class="w-12 text-sm text-[var(--portal-accent)]">{{ item.time.slice(0, 5) }}</strong>
            <span class="min-w-0 flex-1"><span class="block truncate text-sm font-medium text-body-strong">{{ item.name }}</span><span v-if="item.dosage" class="block truncate text-xs text-body-muted">{{ item.dosage }}</span></span>
            <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="sm" aria-label="Excluir lembrete" :loading="deletingReminder === item.id" @click="removeReminder(item)" />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header><h2 class="font-bold text-body-strong">Minha conta</h2></template>
        <div class="space-y-4">
          <div><span class="text-xs text-body-muted">Assinatura</span><strong class="block text-body-strong">{{ subscription?.plan_title || 'Sem plano ativo' }}</strong></div>
          <div><span class="text-xs text-body-muted">Perfis de cuidado</span><strong class="block text-body-strong">{{ profiles.length }}</strong></div>
          <div class="flex gap-2"><UButton to="/painel/cliente/assinatura" label="Assinatura" variant="outline" size="sm" /><UButton :to="veterinary ? '/painel/cliente/pets' : '/painel/cliente/dependentes'" label="Gerenciar perfis" variant="ghost" size="sm" /></div>
        </div>
      </UCard>
    </section>

    <UAlert v-if="!pending && !pets.length" title="Tem um pet?" description="Adicione o perfil dele para liberar o cuidado veterinário." color="info" variant="soft" icon="i-mdi-paw-plus" :actions="[{ label: 'Adicionar pet', to: '/painel/cliente/pets' }]" />

    <UModal v-model:open="reminderOpen">
      <template #content>
        <div class="space-y-4 p-6">
          <div><h2 class="text-xl font-bold text-body-strong">Novo lembrete</h2><p class="text-sm text-body-muted">Para {{ activeProfile.label }} · {{ veterinary ? 'Veterinário' : 'Humano' }}</p></div>
          <UFormField label="Medicamento *"><UInput v-model="reminderForm.name" placeholder="Ex.: Dipirona" class="w-full" /></UFormField>
          <div class="grid gap-4 sm:grid-cols-2"><UFormField label="Dose"><UInput v-model="reminderForm.dosage" placeholder="Ex.: 1 comprimido" class="w-full" /></UFormField><UFormField label="Horário *"><UInput v-model="reminderForm.time" type="time" class="w-full" /></UFormField></div>
          <UFormField label="Orientações"><UTextarea v-model="reminderForm.instructions" placeholder="Ex.: após o almoço" class="w-full" /></UFormField>
          <UAlert v-if="reminderError" color="error" variant="soft" :description="reminderError" />
          <div class="flex justify-end gap-2"><UButton label="Cancelar" variant="ghost" @click="reminderOpen = false" /><UButton label="Salvar lembrete" :loading="savingReminder" @click="saveReminder" /></div>
        </div>
      </template>
    </UModal>
  </div>
</template>
