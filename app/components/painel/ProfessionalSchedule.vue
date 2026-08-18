<script setup lang="ts">
const props = defineProps<{ kind: 'humana' | 'veterinaria' }>()
const { api } = useApi()
const toast = useToast()

interface Specialty { id: string; name: string }
interface Availability { weekday: number; start_time: string; end_time: string; slot_minutes: number }
const specialties = ref<Specialty[]>([])
const selected = ref<string[]>([])
const availability = ref<Availability[]>([])
const pending = ref(true)
const saving = ref(false)
const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

async function load() {
  pending.value = true
  try {
    const [catalog, mine] = await Promise.all([
      api<Specialty[]>(`/scheduling/specialties?kind=${props.kind}`),
      api<{ specialties: Specialty[]; availability: Availability[] }>('/scheduling/mine'),
    ])
    specialties.value = catalog
    selected.value = mine.specialties.map(item => item.id)
    availability.value = mine.availability.map(item => ({ ...item, start_time: item.start_time.slice(0, 5), end_time: item.end_time.slice(0, 5) }))
  } finally { pending.value = false }
}

function toggle(id: string) {
  selected.value = selected.value.includes(id) ? selected.value.filter(item => item !== id) : [...selected.value, id]
}
function addPeriod() { availability.value.push({ weekday: 1, start_time: '08:00', end_time: '12:00', slot_minutes: 30 }) }
async function save() {
  saving.value = true
  try {
    await api('/scheduling/mine', { method: 'PUT', body: { specialty_ids: selected.value, availability: availability.value } })
    toast.add({ title: 'Agenda atualizada', description: 'Os novos horários já podem ser escolhidos pelos pacientes.', color: 'success' })
  } catch (err) {
    toast.add({ title: 'Não foi possível salvar', description: (err as { data?: { error?: string } }).data?.error, color: 'error' })
  } finally { saving.value = false }
}
onMounted(load)
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Minha agenda</h1><p class="mt-1 text-sm text-body-muted">Escolha suas especialidades e os períodos recorrentes de atendimento.</p></div>
    <USkeleton v-if="pending" class="h-80 rounded-xl" />
    <template v-else>
      <UCard>
        <template #header><h2 class="font-semibold text-body-strong">Especialidades atendidas</h2></template>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label v-for="item in specialties" :key="item.id" class="flex cursor-pointer items-center gap-3 rounded-xl border p-3" :class="selected.includes(item.id) ? 'border-[var(--portal-accent)] bg-blue-50/50' : 'border-gray-200'">
            <input type="checkbox" :checked="selected.includes(item.id)" class="size-4" @change="toggle(item.id)" /><span class="text-sm font-medium text-body-strong">{{ item.name }}</span>
          </label>
        </div>
      </UCard>
      <UCard>
        <template #header><div class="flex items-center justify-between gap-3"><div><h2 class="font-semibold text-body-strong">Disponibilidade semanal</h2><p class="text-sm text-body-muted">Os horários ocupados deixam de aparecer automaticamente.</p></div><UButton label="Adicionar período" icon="i-heroicons-plus" variant="outline" size="sm" @click="addPeriod" /></div></template>
        <div v-if="availability.length" class="space-y-3">
          <div v-for="(row, index) in availability" :key="index" class="grid items-end gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <UFormField label="Dia"><USelect v-model="row.weekday" :items="weekdays.map((label, value) => ({ label, value }))" class="w-full" /></UFormField>
            <UFormField label="Início"><UInput v-model="row.start_time" type="time" class="w-full" /></UFormField>
            <UFormField label="Fim"><UInput v-model="row.end_time" type="time" class="w-full" /></UFormField>
            <UFormField label="Duração"><USelect v-model="row.slot_minutes" :items="[20, 30, 40, 60].map(value => ({ label: `${value} min`, value }))" class="w-full" /></UFormField>
            <UButton icon="i-heroicons-trash" color="error" variant="ghost" aria-label="Remover período" @click="availability.splice(index, 1)" />
          </div>
        </div>
        <p v-else class="py-8 text-center text-sm text-body-muted">Adicione ao menos um período para aparecer no agendamento.</p>
      </UCard>
      <div class="flex justify-end"><UButton label="Salvar agenda" icon="i-heroicons-check" :loading="saving" @click="save" /></div>
    </template>
  </div>
</template>
