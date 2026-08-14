<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })
const route = useRoute()
const router = useRouter()
const { api } = useApi()
const toast = useToast()
interface Consultation { id: string; specialty_id: string; specialty_name: string; status: string }
interface Slot { professional_id: string; professional_name: string; time: string }
const consultation = ref<Consultation | null>(null)
const date = ref('')
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Fortaleza' })
const slotKey = ref('')
const slots = ref<Slot[]>([])
const pending = ref(true)
const saving = ref(false)
const slotOptions = computed(() => slots.value.map(item => ({ label: `${item.time} · ${item.professional_name}`, value: `${item.professional_id}|${item.time}` })))

async function loadSlots() {
  slots.value = []
  slotKey.value = ''
  if (!date.value || !consultation.value) return
  slots.value = await api(`/scheduling/slots?specialty_id=${consultation.value.specialty_id}&date=${date.value}`)
}
watch(date, loadSlots)
onMounted(async () => {
  try {
    const rows = await api<Consultation[]>('/consultations')
    consultation.value = rows.find(item => item.id === String(route.params.id)) || null
    if (!consultation.value) await router.replace('/painel/cliente/consultas')
  } finally { pending.value = false }
})
async function submit() {
  if (!date.value || !slotKey.value) return
  const [professional_id, time] = slotKey.value.split('|')
  saving.value = true
  try {
    await api(`/consultations/${route.params.id}/reschedule`, { method: 'PATCH', body: { date: date.value, time, professional_id } })
    toast.add({ title: 'Consulta reagendada', color: 'success' })
    await router.push('/painel/cliente/consultas')
  } catch (err) { toast.add({ title: 'Não foi possível reagendar', description: (err as { data?: { error?: string } }).data?.error, color: 'error' }) } finally { saving.value = false }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Reagendar consulta</h1><p class="mt-1 text-sm text-body-muted">Escolha outro horário disponível para {{ consultation?.specialty_name }}.</p></div>
    <USkeleton v-if="pending" class="h-56 rounded-xl" />
    <UCard v-else-if="consultation">
      <div class="space-y-5">
        <UFormField label="Nova data *"><UInput v-model="date" type="date" :min="today" class="w-full" /></UFormField>
        <UFormField label="Horário e profissional *"><USelect v-model="slotKey" :items="slotOptions" :disabled="!date" :placeholder="slots.length ? 'Selecione' : 'Nenhum horário disponível'" class="w-full" /></UFormField>
        <div class="flex justify-end gap-3"><UButton to="/painel/cliente/consultas" label="Voltar" variant="outline" /><UButton label="Confirmar reagendamento" :disabled="!slotKey" :loading="saving" @click="submit" /></div>
      </div>
    </UCard>
  </div>
</template>
