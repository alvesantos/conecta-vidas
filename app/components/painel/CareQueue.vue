<script setup lang="ts">
const props = defineProps<{ portal: 'medico' | 'vet' }>()
const { api } = useApi()
const toast = useToast()
const items = ref<Array<{
  id: string
  consultation_id: string
  joined_at: string
  priority: number
  owner_name: string
  pet_name: string | null
  dependent_name: string | null
  notes: string | null
}>>([])
const pending = ref(true)
const calling = ref('')
let interval: ReturnType<typeof setInterval> | null = null
const label = computed(() => props.portal === 'medico' ? 'Paciente' : 'Animal')

async function load() {
  try {
    items.value = await api(`/` + `${props.portal}/queue`)
  } finally { pending.value = false }
}
async function call(item: (typeof items.value)[number]) {
  calling.value = item.id
  try {
    await api(`/${props.portal}/queue/${item.id}/call`, { method: 'POST' })
    toast.add({ title: 'Paciente chamado', description: 'O portal do cliente foi atualizado em tempo real.', color: 'success' })
    await load()
  } catch (err) {
    toast.add({ title: 'Não foi possível chamar', description: (err as { data?: { error?: string } }).data?.error, color: 'error' })
  } finally { calling.value = '' }
}
function waiting(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  return `${minutes} min`
}

onMounted(() => {
  load()
  interval = setInterval(load, 10000)
})
onBeforeUnmount(() => { if (interval) clearInterval(interval) })
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <div class="flex items-center justify-between"><div><p class="text-sm font-semibold text-[var(--portal-accent)]">Pronto atendimento</p><h2 class="text-lg font-bold text-body-strong">Fila aguardando</h2></div><UBadge :label="String(items.length)" color="info" variant="soft" /></div>
    </template>
    <USkeleton v-if="pending" class="h-20 rounded-xl" />
    <div v-else-if="items.length" class="divide-y divide-gray-200">
      <div v-for="item in items" :key="item.id" class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full" :class="item.priority > 0 ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'"><UIcon :name="item.priority > 0 ? 'i-heroicons-exclamation-triangle' : (portal === 'medico' ? 'i-heroicons-user' : 'i-mdi-paw')" class="size-6" /></span>
        <div class="min-w-0 flex-1"><p class="font-semibold text-body-strong">{{ portal === 'medico' ? (item.dependent_name || item.owner_name) : item.pet_name }}</p><p class="text-sm text-body-muted">{{ portal === 'medico' ? 'Titular: ' + item.owner_name : 'Tutor: ' + item.owner_name }} · aguardando {{ waiting(item.joined_at) }}</p><p v-if="item.notes" class="mt-1 truncate text-xs text-body-muted">{{ item.notes }}</p></div>
        <UButton :label="`Chamar ${label.toLowerCase()}`" icon="i-heroicons-bell-alert" :loading="calling === item.id" @click="call(item)" />
      </div>
    </div>
    <div v-else class="py-6 text-center text-sm text-body-muted">Ninguém aguardando neste momento.</div>
  </UCard>
</template>
