<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' })

interface Dependent {
  id: string
  name: string
  cpf?: string | null
  birth_date: string
  biological_sex: string
  relationship: string
  phone?: string | null
  legal_guardian_confirmed: boolean
}

const { api } = useApi()
const { loadProfiles } = usePatientProfile()
const rows = ref<Dependent[]>([])
const pending = ref(true)
const saving = ref(false)
const deletingId = ref<string | null>(null)
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const error = ref('')
const form = reactive({
  name: '',
  cpf: '',
  birth_date: '',
  biological_sex: '',
  relationship: '',
  phone: '',
  legal_guardian_confirmed: false,
})
const sexOptions = [
  { label: 'Feminino', value: 'feminino' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Intersexo', value: 'intersexo' },
  { label: 'Prefiro não informar', value: 'nao_informado' },
]
const relationshipOptions = ['Filho(a)', 'Cônjuge', 'Pai/Mãe', 'Irmão/Irmã', 'Outro'].map(value => ({ label: value, value }))

async function load() {
  pending.value = true
  try { rows.value = await api('/patient/dependents') } finally { pending.value = false }
}
function openCreate() {
  editingId.value = null
  Object.assign(form, { name: '', cpf: '', birth_date: '', biological_sex: '', relationship: '', phone: '', legal_guardian_confirmed: false })
  error.value = ''
  modalOpen.value = true
}
function openEdit(item: Dependent) {
  editingId.value = item.id
  Object.assign(form, {
    name: item.name, cpf: item.cpf ?? '', birth_date: item.birth_date.slice(0, 10),
    biological_sex: item.biological_sex, relationship: item.relationship,
    phone: item.phone ?? '', legal_guardian_confirmed: item.legal_guardian_confirmed,
  })
  error.value = ''
  modalOpen.value = true
}
async function save() {
  if (!form.name.trim() || !form.birth_date || !form.biological_sex || !form.relationship) {
    error.value = 'Preencha nome, nascimento, sexo biológico e vínculo.'
    return
  }
  if (!form.legal_guardian_confirmed) {
    error.value = 'Confirme sua autorização ou responsabilidade legal.'
    return
  }
  saving.value = true
  try {
    await api(editingId.value ? `/patient/dependents/${editingId.value}` : '/patient/dependents', {
      method: editingId.value ? 'PUT' : 'POST',
      body: form,
    })
    modalOpen.value = false
    await Promise.all([load(), loadProfiles(true)])
  } catch (err: unknown) {
    error.value = (err as { data?: { error?: string } }).data?.error ?? 'Erro ao salvar dependente.'
  } finally { saving.value = false }
}
async function remove(item: Dependent) {
  if (!window.confirm(`Remover ${item.name} dos perfis ativos? O histórico clínico será preservado.`)) return
  deletingId.value = item.id
  try {
    await api(`/patient/dependents/${item.id}`, { method: 'DELETE' })
    await Promise.all([load(), loadProfiles(true)])
  } finally { deletingId.value = null }
}
onMounted(load)
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div><h1 class="text-2xl font-bold text-body-strong">Dependentes humanos</h1><p class="text-sm text-body-muted">Cada familiar possui perfil e prontuário independentes.</p></div>
      <UButton label="Adicionar dependente" icon="i-heroicons-user-plus" @click="openCreate" />
    </div>
    <USkeleton v-if="pending" class="h-44 rounded-xl" />
    <div v-else-if="rows.length" class="grid gap-4 sm:grid-cols-2">
      <UCard v-for="item in rows" :key="item.id">
        <div class="flex items-start justify-between gap-4">
          <div><span class="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-700"><UIcon name="i-heroicons-user" class="size-6" /></span><h2 class="mt-3 font-semibold text-body-strong">{{ item.name }}</h2><p class="text-sm text-body-muted">{{ item.relationship }} · {{ new Date(`${item.birth_date.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR') }}</p></div>
          <div class="flex gap-1"><UButton icon="i-heroicons-pencil-square" variant="ghost" aria-label="Editar" @click="openEdit(item)" /><UButton icon="i-heroicons-trash" color="error" variant="ghost" aria-label="Remover" :loading="deletingId === item.id" @click="remove(item)" /></div>
        </div>
      </UCard>
    </div>
    <UCard v-else><div class="py-12 text-center"><UIcon name="i-heroicons-user-group" class="mx-auto size-12 text-body-muted" /><p class="mt-3 font-medium text-body-strong">Nenhum dependente cadastrado</p><p class="mt-1 text-sm text-body-muted">Adicione familiares para agendar consultas e manter prontuários separados.</p></div></UCard>

    <UModal v-model:open="modalOpen">
      <template #content>
        <div class="space-y-5 p-6">
          <div><h2 class="text-xl font-semibold text-body-strong">{{ editingId ? 'Editar dependente' : 'Novo dependente' }}</h2><p class="text-sm text-body-muted">Dados usados no atendimento humano.</p></div>
          <UFormField label="Nome completo *"><UInput v-model="form.name" class="w-full" /></UFormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="CPF (quando aplicável)"><UInput v-model="form.cpf" class="w-full" /></UFormField>
            <UFormField label="Data de nascimento *"><UInput v-model="form.birth_date" type="date" class="w-full" /></UFormField>
            <UFormField label="Sexo biológico *"><USelect v-model="form.biological_sex" :items="sexOptions" class="w-full" /></UFormField>
            <UFormField label="Vínculo *"><USelect v-model="form.relationship" :items="relationshipOptions" class="w-full" /></UFormField>
          </div>
          <UFormField label="Telefone"><UInput v-model="form.phone" class="w-full" /></UFormField>
          <label class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm"><UCheckbox v-model="form.legal_guardian_confirmed" class="mt-0.5" /><span class="text-body-muted">Confirmo que possuo autorização ou responsabilidade legal para gerenciar os atendimentos deste dependente.</span></label>
          <UAlert v-if="error" color="error" variant="soft" :description="error" />
          <div class="flex justify-end gap-3"><UButton label="Cancelar" variant="outline" @click="modalOpen = false" /><UButton label="Salvar dependente" :loading="saving" @click="save" /></div>
        </div>
      </template>
    </UModal>
  </div>
</template>
