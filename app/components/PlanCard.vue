<script setup lang="ts">
defineProps<{
  name: string;
  price: number;
  period: "mensal" | "anual";
  description: string;
  features: string[];
  active?: boolean;
  badge?: string;
}>();
</script>

<template>
  <div
    class="relative flex-1 flex flex-col rounded-2xl border p-8 gap-6 transition-all duration-200"
    :class="
      active
        ? 'bg-red-500 bg-linear-to-b from-primary to-[#022a5e] border-transparent text-white shadow-2xl ring-2 ring-[#4a90e2] ring-offset-4'
        : 'bg-white border-gray-200 text-gray-800 shadow-sm hover:shadow-md'
    "
  >
    <!-- Badges -->
    <div class="flex items-center gap-2 flex-wrap min-h-6">
      <span
        v-if="active"
        class="flex items-center gap-1 bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
      >
        <UIcon name="i-heroicons-check-badge-solid" class="size-3.5" />
        Ativo
      </span>
      <span
        v-if="badge"
        class="bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
      >
        {{ badge }}
      </span>
    </div>

    <div class="flex flex-col gap-1">
      <h3 class="text-base font-bold">{{ name }}</h3>
      <p class="text-sm" :class="active ? 'text-white/60' : 'text-gray-500'">
        {{ description }}
      </p>
    </div>

    <div class="flex items-end gap-1">
      <span class="text-2xl font-extrabold"
        >R$ {{ price.toFixed(2).replace(".", ",") }}</span
      >
      <span
        class="text-sm mb-0.5"
        :class="active ? 'text-white/60' : 'text-gray-400'"
        >/{{ period }}</span
      >
    </div>

    <ul class="flex flex-col gap-2.5 flex-1">
      <li
        v-for="feature in features"
        :key="feature"
        class="flex items-center gap-2.5 text-sm"
      >
        <UIcon
          name="i-heroicons-check-circle-solid"
          class="size-4 shrink-0"
          :class="active ? 'text-green-400' : 'text-accent'"
        />
        {{ feature }}
      </li>
    </ul>

    <slot name="action" />
  </div>
</template>
