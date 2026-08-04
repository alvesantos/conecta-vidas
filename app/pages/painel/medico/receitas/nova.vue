<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'medico' })
const { api } = useApi()
const router = useRouter()
const records = ref<Array<{ id: string; patient_id: string; dependent_id?: string | null; patient_name: string }>>([])
const patientOptions = computed(() => records.value.map(item => ({ label: item.patient_name, value: item.id })))
const recordId = ref('')
const content = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  records.value = await api('/medico/records')
})

async function submit() {
  if (!recordId.value || !content.value.trim() || !date.value) {
    error.value = 'Preencha paciente, conteúdo e data.'
    return
  }
  const selected = records.value.find(item => item.id === recordId.value)
  if (!selected) return
  saving.value = true
  try {
    await api('/medico/prescriptions', {
      method: 'POST',
      body: { patient_id: selected.patient_id, dependent_id: selected.dependent_id, content: content.value, date: date.value },
    })
    await router.push('/painel/medico/receitas')
  } catch (err: unknown) {
    error.value = (err as { data?: { error?: string } }).data?.error ?? 'Erro ao emitir receita.'
  } finally {
    saving.value = false
  }
}
</script>
<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div><h1 class="text-2xl font-bold text-body-strong">Nova receita médica</h1><p class="text-sm text-body-muted">A receita será vinculada somente ao prontuário humano.</p></div>
    <UCard>
      <div class="space-y-5">
        <UFormField label="Paciente *"><USelect v-model="recordId" :items="patientOptions" class="w-full" placeholder="Selecione o paciente" /></UFormField>
        <UFormField label="Data *"><UInput v-model="date" type="date" class="w-full" /></UFormField>
        <UFormField label="Prescrição *"><UTextarea v-model="content" :rows="10" class="w-full" placeholder="Medicamento, posologia e orientações" /></UFormField>
        <UAlert v-if="error" color="error" variant="soft" :description="error" />
        <div class="flex justify-end gap-3"><UButton to="/painel/medico/receitas" label="Cancelar" variant="outline" /><UButton label="Emitir receita" :loading="saving" @click="submit" /></div>
      </div>
    </UCard>
  </div>
</template>
