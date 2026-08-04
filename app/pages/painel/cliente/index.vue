<script setup lang="ts">
import type { Subscription } from '~/interfaces/plans'

definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  avatar_url?: string | null
}

interface Consultation {
  id: string
  date: string
  time: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  kind?: 'humana' | 'veterinaria'
  pet_id?: string | null
  dependent_id?: string | null
  dependent_name?: string | null
  vet_name?: string | null
  pet_name?: string | null
}

const { user } = useAuth()
const { api } = useApi()
const { getMySubscription } = usePlans()
const config = useRuntimeConfig()
const { profiles, activeKey, activeProfile, loadProfiles, selectProfile } = usePatientProfile()
const router = useRouter()

const pets = ref<Pet[]>([])
const consultations = ref<Consultation[]>([])
const subscription = ref<Subscription | null>(null)
const pending = ref(true)
const errorMsg = ref('')

const firstName = computed(() => user.value?.name?.trim().split(/\s+/)[0] || 'Cliente')
const uploadsBase = computed(() => config.public.apiBase.replace(/\/api\/?$/, ''))
const visibleConsultations = computed(() => consultations.value.filter(item =>
  activeProfile.value.kind === 'humana'
    ? item.kind === 'humana' && !item.pet_id && (activeProfile.value.dependentId
      ? item.dependent_id === activeProfile.value.dependentId
      : !item.dependent_id)
    : item.kind === 'veterinaria' && item.pet_id === activeProfile.value.petId,
))

const upcomingConsultations = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return visibleConsultations.value
    .filter(item => item.status !== 'cancelada' && item.status !== 'realizada')
    .filter(item => new Date(`${item.date.slice(0, 10)}T00:00:00`) >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
})

const nextConsultation = computed(() => upcomingConsultations.value[0] ?? null)

const quickActions = computed(() => {
  const veterinary = activeProfile.value.kind === 'veterinaria'
  return [
  { label: veterinary ? 'Consulta veterinária' : 'Consulta médica', description: `Atendimento para ${activeProfile.value.label}`, icon: 'i-heroicons-video-camera', to: veterinary ? `/painel/cliente/agendar?tipo=veterinaria&pet=${activeProfile.value.petId}` : `/painel/cliente/agendar?tipo=humana${activeProfile.value.dependentId ? `&dependente=${activeProfile.value.dependentId}` : ''}` },
  { label: 'Cadastrar animal', description: 'Adicione um pet à família', icon: 'i-mdi-paw-plus', to: '/painel/cliente/pets' },
  { label: veterinary ? 'Receitas veterinárias' : 'Receitas médicas', description: `Documentos de ${activeProfile.value.label}`, icon: 'i-heroicons-document-text', to: '/painel/cliente/receitas' },
  { label: veterinary ? 'Maffy Store' : 'Benefícios', description: veterinary ? 'Produtos e vantagens para pets' : 'Serviços e vantagens do seu plano', icon: veterinary ? 'i-heroicons-shopping-bag' : 'i-heroicons-gift', to: '/painel/cliente/marketplace' },
]})

async function loadDashboard() {
  pending.value = true
  errorMsg.value = ''
  const results = await Promise.allSettled([
    api<Pet[]>('/pets/me'),
    api<Consultation[]>('/consultations'),
    getMySubscription(),
  ])

  if (results[0].status === 'fulfilled') pets.value = results[0].value
  if (results[1].status === 'fulfilled') consultations.value = results[1].value
  if (results[2].status === 'fulfilled') subscription.value = results[2].value
  if (results.some(result => result.status === 'rejected')) {
    errorMsg.value = 'Algumas informações não puderam ser carregadas.'
  }
  pending.value = false
}

onMounted(loadDashboard)
onMounted(() => loadProfiles())

function avatarSrc(path?: string | null) {
  return path ? `${uploadsBase.value}${path}` : null
}

function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
}

function formatTime(value: string) {
  return value?.slice(0, 5) || '—'
}

function consultationLabel(item: Consultation) {
  return item.kind === 'humana' ? 'Consulta humana' : 'Consulta veterinária'
}

function statusLabel(status: Consultation['status']) {
  return { agendada: 'Agendada', confirmada: 'Confirmada', realizada: 'Realizada', cancelada: 'Cancelada' }[status]
}

function profileSubtitle(profile: (typeof profiles.value)[number]) {
  if (profile.key === 'human') return 'Titular · Humano'
  if (profile.kind === 'humana') return 'Dependente · Humano'
  return 'Pet · Veterinário'
}

function scheduleHuman() {
  router.push({
    path: '/painel/cliente/agendar',
    query: {
      tipo: 'humana',
      ...(activeProfile.value.kind === 'humana' && activeProfile.value.dependentId
        ? { dependente: activeProfile.value.dependentId }
        : {}),
    },
  })
}

function scheduleAnimal() {
  if (!pets.value.length) {
    router.push('/painel/cliente/pets')
    return
  }
  const selectedPet = activeProfile.value.kind === 'veterinaria'
    ? activeProfile.value.petId
    : pets.value[0]!.id
  router.push({
    path: '/painel/cliente/agendar',
    query: { tipo: 'veterinaria', pet: selectedPet },
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-8">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-[var(--portal-accent)]">Portal do Cliente</p>
        <h2 class="mt-1 text-2xl font-bold text-body-strong sm:text-3xl">Olá, {{ firstName }}</h2>
        <p class="mt-2 text-sm text-body-muted sm:text-base">Tudo sobre os cuidados da sua família em um só lugar.</p>
      </div>
      <UButton to="/painel/cliente/agendar" label="Solicitar consulta" icon="i-heroicons-plus" size="lg" class="justify-center text-white" :style="{ backgroundColor: 'var(--portal-accent)' }" />
    </section>

    <section>
      <div class="mb-4 flex items-end justify-between gap-4">
        <div><h3 class="text-lg font-semibold text-body-strong">Perfis de cuidado</h3><p class="text-sm text-body-muted">Selecione para adaptar todo o painel.</p></div>
        <UButton to="/painel/cliente/dependentes" label="Adicionar familiar" variant="ghost" size="sm" class="hidden sm:flex" />
      </div>
      <div class="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3">
        <button
          v-for="profile in profiles"
          :key="profile.key"
          type="button"
          class="flex min-w-52 snap-start items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm dark:bg-[#071b30]"
          :class="activeKey === profile.key ? 'border-[var(--portal-accent)] shadow-sm' : 'border-gray-200 dark:border-white/10'"
          @click="selectProfile(profile.key)"
        >
          <span class="flex size-11 shrink-0 items-center justify-center rounded-full" :class="profile.kind === 'humana' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'">
            <UIcon :name="profile.kind === 'humana' ? 'i-heroicons-user' : 'i-mdi-paw'" class="size-6" />
          </span>
          <span class="min-w-0"><span class="block truncate font-semibold text-body-strong">{{ profile.label }}</span><span class="mt-0.5 block text-xs text-body-muted">{{ profileSubtitle(profile) }}</span></span>
          <UIcon v-if="activeKey === profile.key" name="i-heroicons-check-circle-solid" class="ml-auto size-5 shrink-0 text-[var(--portal-accent)]" />
        </button>
        <NuxtLink to="/painel/cliente/pets" class="flex min-w-40 snap-start items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-4 text-sm font-medium text-body-muted transition hover:border-[var(--portal-accent)] hover:text-[var(--portal-accent)] dark:border-white/15">
          <UIcon name="i-heroicons-plus" class="size-5" /> Adicionar perfil
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#071b30] sm:p-6">
      <div class="mb-5">
        <p class="text-sm font-medium text-[var(--portal-accent)]">Novo atendimento</p>
        <h3 class="mt-1 text-xl font-bold text-body-strong sm:text-2xl">Quem vamos cuidar hoje?</h3>
        <p class="mt-1 text-sm text-body-muted">Escolha o tipo de consulta para continuar.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <button type="button" class="group flex min-h-36 items-center gap-5 rounded-2xl border-2 border-gray-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--portal-accent)] hover:shadow-md dark:border-white/10" @click="scheduleHuman">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-[var(--portal-accent)] group-hover:text-white dark:bg-blue-500/10 dark:text-blue-300"><UIcon name="i-mdi-doctor" class="size-8" /></span>
          <span><span class="block text-lg font-bold text-body-strong">Humano</span><span class="mt-1 block text-sm text-body-muted">Marcar consulta médica para você.</span><span class="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--portal-accent)]">Continuar <UIcon name="i-heroicons-arrow-right" /></span></span>
        </button>
        <button type="button" class="group flex min-h-36 items-center gap-5 rounded-2xl border-2 border-gray-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--portal-accent)] hover:shadow-md dark:border-white/10" @click="scheduleAnimal">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition group-hover:bg-[var(--portal-accent)] group-hover:text-white dark:bg-sky-500/10 dark:text-sky-300"><UIcon name="i-mdi-paw" class="size-8" /></span>
          <span><span class="block text-lg font-bold text-body-strong">Animal</span><span class="mt-1 block text-sm text-body-muted">{{ pets.length ? 'Marcar consulta veterinária.' : 'Cadastre um pet para continuar.' }}</span><span class="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--portal-accent)]">Continuar <UIcon name="i-heroicons-arrow-right" /></span></span>
        </button>
      </div>
    </section>

    <UAlert v-if="errorMsg" color="warning" variant="soft" :description="errorMsg" />

    <UAlert
      v-if="!pending && pets.length === 0"
      title="Tem um pet?"
      description="Adicione o perfil dele e tenha acesso imediato às consultas veterinárias."
      color="info"
      variant="soft"
      icon="i-mdi-paw-plus"
      :actions="[{ label: 'Adicionar pet', to: '/painel/cliente/pets', color: 'primary' }]"
    />

    <div v-if="!pending" class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#071b30]">
      Exibindo informações de <strong>{{ activeProfile.label }}</strong>.
    </div>

    <section v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="item in 3" :key="item" class="h-36 rounded-xl" />
    </section>

    <section v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard class="border-l-4 border-l-[var(--portal-accent)]">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-body-muted">Próxima consulta</p>
            <template v-if="nextConsultation">
              <p class="mt-2 text-xl font-bold text-body-strong">{{ formatDate(nextConsultation.date) }}</p>
              <p class="mt-1 text-sm text-body-muted">{{ formatTime(nextConsultation.time) }} · {{ consultationLabel(nextConsultation) }}</p>
            </template>
            <p v-else class="mt-2 font-semibold text-body-strong">Nenhuma agendada</p>
          </div>
          <span class="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><UIcon name="i-heroicons-calendar-days" class="size-6" /></span>
        </div>
        <UButton :to="nextConsultation ? '/painel/cliente/consultas' : '/painel/cliente/agendar'" :label="nextConsultation ? 'Ver consultas' : 'Agendar agora'" variant="link" class="mt-3 px-0" />
      </UCard>

      <UCard>
        <div class="flex items-start justify-between">
          <div><p class="text-sm text-body-muted">Animais cadastrados</p><p class="mt-2 text-3xl font-bold text-body-strong">{{ pets.length }}</p><p class="mt-1 text-sm text-body-muted">{{ pets.length === 1 ? 'animal na sua família' : 'animais na sua família' }}</p></div>
          <span class="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"><UIcon name="i-mdi-paw" class="size-6" /></span>
        </div>
        <UButton to="/painel/cliente/pets" label="Gerenciar animais" variant="link" class="mt-3 px-0" />
      </UCard>

      <UCard>
        <div class="flex items-start justify-between">
          <div><p class="text-sm text-body-muted">Assinatura</p><p class="mt-2 text-xl font-bold text-body-strong">{{ subscription?.plan_title || 'Sem plano ativo' }}</p><p class="mt-1 text-sm text-body-muted">{{ subscription ? 'Assinatura ativa' : 'Conheça os planos disponíveis' }}</p></div>
          <span class="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><UIcon name="i-heroicons-shield-check" class="size-6" /></span>
        </div>
        <UButton :to="subscription ? '/painel/cliente/assinatura' : '/assinaturas'" :label="subscription ? 'Ver assinatura' : 'Ver planos'" variant="link" class="mt-3 px-0" />
      </UCard>
    </section>

    <section>
      <div class="mb-4"><h3 class="text-lg font-semibold text-body-strong">Acesso rápido</h3><p class="text-sm text-body-muted">O que você precisa fazer hoje?</p></div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink v-for="action in quickActions" :key="action.to" :to="action.to" class="group flex min-h-24 items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--portal-accent)] hover:shadow-sm dark:border-white/10 dark:bg-[#071b30]">
          <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[var(--portal-accent)] group-hover:bg-[var(--portal-accent)] group-hover:text-white dark:bg-white/10"><UIcon :name="action.icon" class="size-6" /></span>
          <span><span class="block text-sm font-semibold text-body-strong">{{ action.label }}</span><span class="mt-1 block text-xs text-body-muted">{{ action.description }}</span></span>
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <UCard class="lg:col-span-2">
        <template #header><div class="flex items-center justify-between"><div><h3 class="font-semibold text-body-strong">Próximas consultas</h3><p class="text-sm text-body-muted">Seus próximos atendimentos</p></div><UButton to="/painel/cliente/consultas" label="Ver todas" variant="ghost" size="sm" /></div></template>
        <div v-if="upcomingConsultations.length" class="divide-y divide-gray-200 dark:divide-white/10">
          <div v-for="item in upcomingConsultations.slice(0, 4)" :key="item.id" class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
            <div class="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-100 text-xs dark:bg-white/10"><strong class="text-body-strong">{{ new Date(`${item.date.slice(0, 10)}T00:00:00`).getDate() }}</strong><span class="text-body-muted">{{ new Date(`${item.date.slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') }}</span></div>
            <div class="min-w-0 flex-1"><p class="font-medium text-body-strong">{{ consultationLabel(item) }}<span v-if="item.pet_name"> · {{ item.pet_name }}</span></p><p class="mt-1 text-sm text-body-muted">{{ formatTime(item.time) }} · {{ item.vet_name || 'Profissional a definir' }}</p></div>
            <UBadge :label="statusLabel(item.status)" :color="item.status === 'confirmada' ? 'success' : 'info'" variant="soft" />
          </div>
        </div>
        <div v-else class="flex flex-col items-center py-10 text-center"><UIcon name="i-heroicons-calendar-days" class="size-10 text-body-muted" /><p class="mt-3 font-medium text-body-strong">Nenhuma consulta agendada</p><p class="mt-1 text-sm text-body-muted">Quando precisar, solicite um atendimento.</p><UButton to="/painel/cliente/agendar" label="Solicitar consulta" class="mt-4" /></div>
      </UCard>

      <UCard>
        <template #header><div><h3 class="font-semibold text-body-strong">Minha família animal</h3><p class="text-sm text-body-muted">Acesso rápido aos seus pets</p></div></template>
        <div v-if="pets.length" class="space-y-3">
          <NuxtLink v-for="pet in pets.slice(0, 4)" :key="pet.id" to="/painel/cliente/pets" class="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-white/5">
            <img v-if="avatarSrc(pet.avatar_url)" :src="avatarSrc(pet.avatar_url)!" :alt="pet.name" class="size-10 rounded-full object-cover" />
            <span v-else class="flex size-10 items-center justify-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-500/10"><UIcon :name="speciesIcon(pet.species)" class="size-5" /></span>
            <span class="min-w-0"><span class="block truncate text-sm font-medium text-body-strong">{{ pet.name }}</span><span class="block truncate text-xs text-body-muted">{{ speciesLabel(pet.species) }} · {{ pet.breed }}</span></span>
          </NuxtLink>
          <UButton to="/painel/cliente/pets" label="Ver todos os animais" variant="outline" block class="mt-3" />
        </div>
        <div v-else class="py-7 text-center"><UIcon name="i-mdi-paw-plus" class="mx-auto size-10 text-body-muted" /><p class="mt-3 text-sm text-body-muted">Você ainda não cadastrou animais.</p><UButton to="/painel/cliente/pets" label="Cadastrar animal" variant="outline" class="mt-4" /></div>
      </UCard>
    </section>
  </div>
</template>
