<script setup lang="ts">
defineProps<{ title: string; description: string; icon?: string }>()
</script>

<template>
  <UCard class="mx-auto max-w-3xl">
    <div class="flex flex-col items-center py-12 text-center">
      <span class="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[var(--portal-accent)]/10 text-[var(--portal-accent)]">
        <UIcon :name="icon ?? 'i-heroicons-wrench-screwdriver'" class="size-8" />
      </span>
      <UBadge label="Em desenvolvimento" color="neutral" variant="soft" />
      <h2 class="mt-4 text-2xl font-semibold text-body-strong">{{ title }}</h2>
      <p class="mt-2 max-w-xl text-sm leading-6 text-body-muted">{{ description }}</p>
    </div>
  </UCard>
</template>
