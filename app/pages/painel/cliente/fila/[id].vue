<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface QueueState {
  id: string
  consultation_id: string
  kind: 'humano' | 'veterinario'
  status: 'aguardando' | 'chamado' | 'em_atendimento' | 'concluido' | 'saiu'
  position: number | null
  estimate: string | null
  joined_at: string
  called_at: string | null
  professional_name: string | null
  pet_name: string | null
  dependent_name: string | null
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { api } = useApi()
const toast = useToast()
const state = ref<QueueState | null>(null)
const pending = ref(true)
const leaving = ref(false)
const leaveOpen = ref(false)
const connection = ref<'conectado' | 'reconectando' | 'desconectado'>('desconectado')
const elapsedSeconds = ref(0)
const notificationPermission = ref<NotificationPermission | 'unsupported'>('unsupported')
let source: EventSource | null = null
let timer: ReturnType<typeof setInterval> | null = null
let notifiedCalled = false

const consultationId = computed(() => String(route.params.id))
const waiting = computed(() => state.value?.status === 'aguardando')
const content = computed(() => state.value?.kind === 'veterinario'
  ? [
      'Mantenha seu pet em um ambiente tranquilo e seguro.',
      'Separe informações sobre alimentação, medicamentos e sintomas recentes.',
      'Se houver piora súbita, procure atendimento veterinário presencial.',
    ]
  : [
      'Separe seus documentos e a lista de medicamentos em uso.',
      'Permaneça em um ambiente calmo e com boa conexão.',
      'Se houver piora súbita ou sinal de emergência, procure atendimento presencial.',
    ])
const elapsed = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600)
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60)
  const seconds = elapsedSeconds.value % 60
  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
})

function updateElapsed() {
  if (!state.value?.joined_at) return
  elapsedSeconds.value = Math.max(0, Math.floor((Date.now() - new Date(state.value.joined_at).getTime()) / 1000))
}

function handleState(next: QueueState | null) {
  if (!next) return
  const becameCalled = state.value?.status !== 'chamado' && next.status === 'chamado'
  state.value = next
  updateElapsed()
  if (becameCalled && !notifiedCalled) {
    notifiedCalled = true
    toast.add({ title: 'Profissional disponível!', description: `${next.professional_name || 'O profissional'} chamou você para o atendimento.`, color: 'success' })
    if (notificationPermission.value === 'granted') {
      new Notification('ConectaVidas — Sua vez chegou', { body: `${next.professional_name || 'O profissional'} está disponível para atender.` })
    }
  }
}

function connect() {
  source?.close()
  const url = `${config.public.apiBase}/patient/queue/${consultationId.value}/events`
  source = new EventSource(url, { withCredentials: true })
  connection.value = 'reconectando'
  source.onopen = () => { connection.value = 'conectado' }
  source.addEventListener('queue', event => {
    connection.value = 'conectado'
    handleState(JSON.parse((event as MessageEvent).data) as QueueState)
  })
  source.onerror = () => {
    connection.value = 'reconectando'
  }
}

async function load() {
  pending.value = true
  try {
    handleState(await api<QueueState>(`/patient/queue/${consultationId.value}`))
    connect()
  } catch {
    await router.replace('/painel/cliente/consultas')
  } finally { pending.value = false }
}

async function enableNotifications() {
  if (!('Notification' in window)) return
  notificationPermission.value = await Notification.requestPermission()
}

async function leaveQueue() {
  leaving.value = true
  try {
    await api(`/patient/queue/${consultationId.value}/leave`, { method: 'POST' })
    leaveOpen.value = false
    source?.close()
    if (state.value) state.value.status = 'saiu'
    toast.add({ title: 'Você saiu da fila', color: 'neutral' })
  } catch (err) {
    toast.add({ title: 'Não foi possível sair', description: (err as { data?: { error?: string } }).data?.error, color: 'error' })
  } finally { leaving.value = false }
}

onMounted(() => {
  notificationPermission.value = 'Notification' in window ? Notification.permission : 'unsupported'
  timer = setInterval(updateElapsed, 1000)
  load()
})
onBeforeUnmount(() => {
  source?.close()
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <USkeleton v-if="pending" class="h-[30rem] rounded-2xl" />
    <template v-else-if="state">
      <header class="text-center">
        <p class="text-sm font-semibold text-[var(--portal-accent)]">Sala de espera virtual</p>
        <h1 class="mt-1 text-2xl font-bold text-body-strong">{{ state.kind === 'humano' ? 'Pronto atendimento médico' : 'Pronto atendimento veterinário' }}</h1>
        <p class="mt-2 text-sm text-body-muted">{{ state.pet_name || state.dependent_name || 'Titular da conta' }}</p>
      </header>

      <UAlert v-if="connection === 'reconectando' && waiting" color="warning" variant="soft" icon="i-heroicons-arrow-path" title="Reconectando atualização da fila" description="Sua posição está preservada. Não feche a página enquanto restabelecemos a conexão." />

      <UCard v-if="waiting" class="overflow-hidden">
        <div class="py-5 text-center">
          <span class="mx-auto flex size-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-[var(--portal-accent)] dark:bg-blue-500/10">{{ state.position || '—' }}</span>
          <p class="mt-3 text-sm text-body-muted">Sua posição aproximada</p>
          <h2 class="mt-1 text-xl font-bold text-body-strong">{{ state.estimate }}</h2>
          <p class="mt-2 text-xs text-body-muted">A estimativa pode mudar conforme a complexidade dos atendimentos e a prioridade clínica.</p>
          <div class="mx-auto mt-6 max-w-xs rounded-xl bg-gray-50 p-4 dark:bg-white/5"><p class="text-xs uppercase tracking-wide text-body-muted">Tempo na sala</p><p class="mt-1 font-mono text-2xl font-bold text-body-strong">{{ elapsed }}</p></div>
        </div>
      </UCard>

      <UCard v-else-if="state.status === 'chamado' || state.status === 'em_atendimento'">
        <div class="py-8 text-center">
          <span class="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><UIcon name="i-heroicons-bell-alert" class="size-10" /></span>
          <h2 class="mt-4 text-2xl font-bold text-body-strong">Sua vez chegou!</h2>
          <p class="mt-2 text-body-muted">{{ state.professional_name || 'O profissional' }} está disponível para o atendimento.</p>
          <UButton to="/painel/cliente/consultas" label="Abrir atendimento" icon="i-heroicons-video-camera" size="lg" class="mt-6" />
        </div>
      </UCard>

      <UCard v-else>
        <div class="py-8 text-center"><UIcon name="i-heroicons-information-circle" class="mx-auto size-12 text-body-muted" /><h2 class="mt-3 text-xl font-bold text-body-strong">{{ state.status === 'saiu' ? 'Você saiu da fila' : 'Atendimento encerrado' }}</h2><UButton to="/painel/cliente" label="Voltar ao painel" class="mt-5" /></div>
      </UCard>

      <UCard v-if="waiting">
        <template #header><h2 class="font-bold text-body-strong">Enquanto você aguarda</h2></template>
        <ul class="space-y-3"><li v-for="item in content" :key="item" class="flex gap-3 text-sm text-body-muted"><UIcon name="i-heroicons-check-circle" class="mt-0.5 size-5 shrink-0 text-emerald-600" />{{ item }}</li></ul>
      </UCard>

      <div v-if="waiting" class="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <UButton v-if="notificationPermission === 'default'" label="Ativar notificações" icon="i-heroicons-bell" variant="outline" @click="enableNotifications" />
        <span v-else />
        <UButton label="Sair da fila" color="error" variant="ghost" @click="leaveOpen = true" />
      </div>

      <UModal v-model:open="leaveOpen">
        <template #content>
          <div class="space-y-4 p-6"><div><h2 class="text-xl font-bold text-body-strong">Sair da fila?</h2><p class="mt-1 text-sm text-body-muted">Sua solicitação será cancelada. Para retornar, será necessário realizar uma nova triagem.</p></div><div class="flex justify-end gap-3"><UButton label="Continuar aguardando" variant="outline" @click="leaveOpen = false" /><UButton label="Sair e cancelar" color="error" :loading="leaving" @click="leaveQueue" /></div></div>
        </template>
      </UModal>
    </template>
  </div>
</template>
