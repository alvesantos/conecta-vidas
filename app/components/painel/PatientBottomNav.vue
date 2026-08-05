<script setup lang="ts">
const route = useRoute()
const { activeProfile } = usePatientProfile()
const { show } = usePatientConecta()
const veterinary = computed(() => activeProfile.value.kind === 'veterinaria')

const items = computed(() => [
  { label: 'Início', icon: 'i-heroicons-home', to: '/painel/cliente' },
  { label: 'Histórico', icon: 'i-heroicons-clock', to: '/painel/cliente/prontuarios' },
  { label: veterinary.value ? 'Loja' : 'Benefícios', icon: veterinary.value ? 'i-heroicons-shopping-bag' : 'i-heroicons-gift', to: '/painel/cliente/marketplace' },
])

function active(to: string) {
  return to === '/painel/cliente' ? route.path === to : route.path.startsWith(to)
}
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(1,25,58,.08)] backdrop-blur dark:border-white/10 dark:bg-[#011428]/95 lg:hidden" aria-label="Navegação principal">
    <div class="mx-auto grid max-w-md grid-cols-4 items-end">
      <NuxtLink :to="items[0]!.to" class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium" :class="active(items[0]!.to) ? 'text-[var(--portal-accent)] dark:text-blue-300' : 'text-body-muted'"><UIcon :name="items[0]!.icon" class="size-5" />{{ items[0]!.label }}</NuxtLink>
      <NuxtLink :to="items[1]!.to" class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium" :class="active(items[1]!.to) ? 'text-[var(--portal-accent)] dark:text-blue-300' : 'text-body-muted'"><UIcon :name="items[1]!.icon" class="size-5" />{{ items[1]!.label }}</NuxtLink>
      <button type="button" class="-mt-5 flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-[var(--portal-accent)] px-3 text-[11px] font-semibold text-white shadow-lg" aria-label="Abrir Conecta" @click="show"><UIcon name="i-heroicons-plus" class="size-6" />Conecta</button>
      <NuxtLink :to="items[2]!.to" class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium" :class="active(items[2]!.to) ? 'text-[var(--portal-accent)] dark:text-blue-300' : 'text-body-muted'"><UIcon :name="items[2]!.icon" class="size-5" />{{ items[2]!.label }}</NuxtLink>
    </div>
  </nav>
</template>
