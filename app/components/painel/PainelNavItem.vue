<script setup lang="ts">
import type { PortalNavItem } from '~/config/portals'

const props = defineProps<{
  item: PortalNavItem
  collapsed?: boolean
  badgeCount?: number
}>()

const route = useRoute()
const active = computed(() =>
  route.path === props.item.to || route.path.startsWith(`${props.item.to}/`),
)
</script>

<template>
  <NuxtLink
    :to="item.to"
    :aria-label="collapsed ? item.label : undefined"
    :aria-current="active ? 'page' : undefined"
    :title="collapsed ? item.label : undefined"
    class="relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-body-muted transition-colors hover:bg-black/5 hover:text-body-strong dark:hover:bg-white/10"
    :class="{ 'font-semibold text-body-strong bg-black/5 dark:bg-white/10': active, 'justify-center': collapsed }"
  >
    <span v-if="active" class="absolute inset-y-2 left-0 w-0.75 rounded-full bg-[var(--portal-accent)]" />
    <UIcon :name="item.icon" class="size-5 shrink-0" />
    <span v-if="!collapsed" class="min-w-0 flex-1 truncate">{{ item.label }}</span>
    <UBadge v-if="badgeCount" color="error" size="xs">{{ badgeCount }}</UBadge>
  </NuxtLink>
</template>
