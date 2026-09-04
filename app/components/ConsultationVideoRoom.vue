<script setup lang="ts">
interface RoomResponse {
  domain: string
  room_name: string
  meet_link: string
  recording_enabled: false
}

const props = defineProps<{ consultationId: string }>()
const emit = defineEmits<{ left: [] }>()
const { api } = useApi()
const { user } = useAuth()

const container = ref<HTMLElement | null>(null)
const pending = ref(true)
const errorMessage = ref('')
const connection = ref<'conectando' | 'conectado' | 'reconectando' | 'encerrado'>('conectando')
let jitsiApi: any = null

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => any
  }
}

function loadJitsiScript(domain: string) {
  if (window.JitsiMeetExternalAPI) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-conecta-jitsi]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar o Jitsi.')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = `https://${domain}/external_api.js`
    script.async = true
    script.dataset.conectaJitsi = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Falha ao carregar o Jitsi.'))
    document.head.appendChild(script)
  })
}

async function connect() {
  pending.value = true
  errorMessage.value = ''
  connection.value = 'conectando'
  try {
    const room = await api<RoomResponse>(`/consultations/${props.consultationId}/room`)
    await loadJitsiScript(room.domain)
    if (!container.value || !window.JitsiMeetExternalAPI) throw new Error('Videoconferência indisponível.')

    jitsiApi?.dispose()
    jitsiApi = new window.JitsiMeetExternalAPI(room.domain, {
      roomName: room.room_name,
      parentNode: container.value,
      width: '100%',
      height: '100%',
      userInfo: { displayName: user.value?.name || 'Participante ConectaVidas' },
      configOverwrite: {
        prejoinPageEnabled: true,
        disableDeepLinking: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        recordingService: { enabled: false },
        localRecording: { disable: true },
        liveStreaming: { enabled: false },
        fileRecordingsEnabled: false,
        dropbox: { appKey: '' },
        toolbarButtons: [
          'microphone', 'camera', 'desktop', 'chat', 'tileview',
          'select-background', 'settings', 'hangup', 'fullscreen',
        ],
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        SHOW_JITSI_WATERMARK: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      },
    })

    jitsiApi.addListener('videoConferenceJoined', () => { connection.value = 'conectado' })
    jitsiApi.addListener('connectionInterrupted', () => { connection.value = 'reconectando' })
    jitsiApi.addListener('connectionRestored', () => { connection.value = 'conectado' })
    jitsiApi.addListener('videoConferenceLeft', () => {
      connection.value = 'encerrado'
      emit('left')
    })
    jitsiApi.addListener('readyToClose', () => {
      connection.value = 'encerrado'
      emit('left')
    })
  } catch (err) {
    errorMessage.value = (err as { data?: { error?: string }; message?: string }).data?.error
      || (err as Error).message
      || 'Não foi possível abrir a sala.'
  } finally {
    pending.value = false
  }
}

onMounted(connect)
onBeforeUnmount(() => {
  jitsiApi?.dispose()
  jitsiApi = null
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 text-sm text-body-muted">
        <span
          class="size-2.5 rounded-full"
          :class="connection === 'conectado' ? 'bg-emerald-500' : connection === 'reconectando' ? 'animate-pulse bg-amber-500' : 'bg-gray-400'"
        />
        {{ connection === 'conectado' ? 'Conectado' : connection === 'reconectando' ? 'Reconectando…' : connection === 'encerrado' ? 'Você saiu da sala' : 'Preparando conexão…' }}
      </div>
      <p class="text-xs text-body-muted">Não compartilhe o acesso desta consulta.</p>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      title="Não foi possível abrir a videoconferência"
      :description="errorMessage"
    >
      <template #actions>
        <UButton label="Tentar novamente" size="xs" color="error" variant="outline" @click="connect" />
      </template>
    </UAlert>
    <USkeleton v-if="pending" class="h-[80vh] min-h-[560px] rounded-xl" />
    <div
      ref="container"
      class="h-[80vh] min-h-[560px] overflow-hidden rounded-xl bg-gray-950"
      :class="{ hidden: pending || errorMessage }"
    />
    <p class="text-xs text-body-muted">
      Áudio e vídeo não são gravados pelo ConectaVidas. O chat da sala é temporário;
      informações clínicas e documentos devem ser registrados no prontuário.
    </p>
  </div>
</template>
