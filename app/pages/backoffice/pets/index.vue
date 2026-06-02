<script setup lang="ts">
definePageMeta({ layout: 'backoffice', middleware: 'admin' });

interface AdminPetRow {
  id: string;
  name: string;
  species: string;
  breed: string;
  size: string;
  birth_date: string;
  avatar_url?: string | null;
  owner_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
}

const { api } = useApi();
const config = useRuntimeConfig();

const pets = ref<AdminPetRow[]>([]);
const pending = ref(true);

const uploadsBase = computed(() => config.public.apiBase.replace(/\/api\/?$/, ''));

function avatarSrc(avatarUrl?: string | null) {
  if (!avatarUrl) return null;
  return `${uploadsBase.value}${avatarUrl}`;
}

// speciesIcon e speciesLabel vêm do composable useSpecies (auto-import)

const columns = [
  { accessorKey: 'name', header: 'Animal' },
  { accessorKey: 'species', header: 'Espécie' },
  { accessorKey: 'breed', header: 'Raça' },
  { accessorKey: 'size', header: 'Porte' },
  { accessorKey: 'owner_name', header: 'Responsável' },
  { id: 'chevron', header: '' },
];

onMounted(async () => {
  try {
    pets.value = await api<AdminPetRow[]>('/admin/pets');
  } finally {
    pending.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Animais</h1>
    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Todos os animais cadastrados no sistema</p>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow mt-6">
      <UTable
        :data="pets"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{ tbody: '[&>tr]:cursor-pointer' }"
        @select="(row) => $router.push(`/backoffice/pets/${row.original.id}`)"
      >
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-accent/10 overflow-hidden flex items-center justify-center shrink-0">
              <img v-if="avatarSrc(row.original.avatar_url)" :src="avatarSrc(row.original.avatar_url)!" class="w-full h-full object-cover" />
              <UIcon v-else :name="speciesIcon(row.original.species)" class="text-accent size-6" />
            </div>
            <span class="font-medium text-gray-800 dark:text-gray-100">{{ row.original.name }}</span>
          </div>
        </template>

        <template #species-cell="{ row }">
          {{ speciesLabel(row.original.species) }}
        </template>

        <template #size-cell="{ row }">
          <span class="capitalize">{{ row.original.size }}</span>
        </template>

        <template #owner_name-cell="{ row }">
          <div class="flex flex-col">
            <span>{{ row.original.owner_name || '—' }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ row.original.owner_email || '' }}</span>
          </div>
        </template>

        <template #chevron-cell>
          <div class="flex justify-end">
            <UIcon name="i-heroicons-chevron-right" class="size-5 text-gray-400 dark:text-gray-500" />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <UIcon name="i-mdi-paw" class="size-10 mb-2" />
            <p class="text-sm">Nenhum animal encontrado.</p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
