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

onMounted(async () => {
  try {
    pets.value = await api<AdminPetRow[]>('/admin/pets');
  } finally {
    pending.value = false;
  }
});
</script>

<template>
  <div class="max-w-7xl">
    <h1 class="text-2xl font-bold text-gray-800">Animais</h1>
    <p class="text-gray-500 text-sm mt-1">Todos os animais cadastrados no sistema</p>

    <div class="bg-white rounded-xl shadow overflow-x-auto mt-6">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Animal</th>
            <th class="px-4 py-3 font-medium">Espécie</th>
            <th class="px-4 py-3 font-medium">Raça</th>
            <th class="px-4 py-3 font-medium">Porte</th>
            <th class="px-4 py-3 font-medium">Responsável</th>
            <th class="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Carregando...</td>
          </tr>
          <tr v-else-if="pets.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Nenhum animal encontrado.</td>
          </tr>
          <tr
            v-for="pet in pets"
            :key="pet.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="$router.push(`/backoffice/pets/${pet.id}`)"
          >
            <td class="px-4 py-3 flex items-center gap-3">
              <div class="size-10 rounded-full bg-accent/10 overflow-hidden flex items-center justify-center">
                <img v-if="avatarSrc(pet.avatar_url)" :src="avatarSrc(pet.avatar_url)!" class="w-full h-full object-cover" />
                <UIcon v-else :name="speciesIcon(pet.species)" class="text-accent size-6" />
              </div>
              <span class="font-medium text-gray-800">{{ pet.name }}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ speciesLabel(pet.species) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ pet.breed }}</td>
            <td class="px-4 py-3 capitalize text-gray-600">{{ pet.size }}</td>
            <td class="px-4 py-3 text-gray-600">
              <div class="flex flex-col">
                <span>{{ pet.owner_name || '—' }}</span>
                <span class="text-xs text-gray-400">{{ pet.owner_email || '' }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <UIcon name="i-heroicons-chevron-right" class="size-5 text-gray-400" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
