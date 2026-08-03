<script setup lang="ts">
const { profiles, activeKey, activeProfile, loading, loadProfiles, selectProfile } = usePatientProfile()

const items = computed(() => profiles.value.map(profile => ({
  label: profile.label,
  value: profile.key,
  icon: profile.kind === 'humana' ? 'i-heroicons-user-circle' : 'i-mdi-paw',
})))

onMounted(() => loadProfiles())
</script>

<template>
  <div class="border-b border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#071b30] md:px-6 lg:px-10">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
      <div class="min-w-0">
        <p class="text-xs font-medium uppercase tracking-wide text-body-muted">Perfil em atendimento</p>
        <p class="truncate text-sm font-semibold text-body-strong">{{ activeProfile.label }}</p>
      </div>
      <USelect
        :model-value="activeKey"
        :items="items"
        value-key="value"
        class="w-52"
        :loading="loading"
        aria-label="Selecionar perfil em atendimento"
        @update:model-value="selectProfile(String($event))"
      />
    </div>
  </div>
</template>
