<script setup lang="ts">
const { open, hide } = usePatientConecta()
const { profiles, activeKey, activeProfile, selectProfile, loadProfiles } = usePatientProfile()
const router = useRouter()

const veterinary = computed(() => activeProfile.value.kind === 'veterinaria')
const profileOptions = computed(() => profiles.value.map(profile => ({
  label: `${profile.label} · ${profile.kind === 'humana' ? 'Humano' : 'Veterinário'}`,
  value: profile.key,
})))

watch(open, value => {
  if (value) loadProfiles()
})

function go(atendimento: 'pronto' | 'especialista') {
  const profile = activeProfile.value
  hide()
  router.push({
    path: atendimento === 'pronto' ? '/painel/cliente/triagem' : '/painel/cliente/agendar',
    query: {
      tipo: profile.kind,
      atendimento,
      ...(profile.petId ? { pet: profile.petId } : {}),
      ...(profile.dependentId ? { dependente: profile.dependentId } : {}),
    },
  })
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <div class="space-y-5 p-6">
        <div>
          <p class="text-sm font-semibold text-[var(--portal-accent)]">Conecta</p>
          <h2 class="mt-1 text-xl font-bold text-body-strong">Como podemos cuidar de {{ activeProfile.label }}?</h2>
          <p class="mt-1 text-sm text-body-muted">Contexto {{ veterinary ? 'veterinário' : 'humano' }} selecionado.</p>
        </div>
        <UFormField label="Quem será atendido?">
          <USelect :model-value="activeKey" :items="profileOptions" class="w-full" size="lg" @update:model-value="selectProfile(String($event))" />
        </UFormField>
        <button type="button" class="flex w-full items-center gap-4 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-[var(--portal-accent)]" @click="go('pronto')">
          <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"><UIcon name="i-heroicons-bolt" class="size-6" /></span>
          <span><strong class="block text-body-strong">Pronto atendimento {{ veterinary ? 'veterinário' : 'médico' }}</strong><span class="mt-1 block text-sm text-body-muted">Solicite atendimento com prioridade.</span></span>
        </button>
        <button type="button" class="flex w-full items-center gap-4 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-[var(--portal-accent)]" @click="go('especialista')">
          <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><UIcon name="i-mdi-stethoscope" class="size-6" /></span>
          <span><strong class="block text-body-strong">Agendar especialista {{ veterinary ? 'veterinário' : 'médico' }}</strong><span class="mt-1 block text-sm text-body-muted">Escolha o melhor atendimento para o perfil.</span></span>
        </button>
        <UButton label="Cancelar" variant="ghost" block @click="hide" />
      </div>
    </template>
  </UModal>
</template>
