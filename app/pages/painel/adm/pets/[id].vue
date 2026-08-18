<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

interface AdminPetDetail {
  id: string;
  name: string;
  species: string;
  breed: string;
  size: string;
  coat: string;
  coat_color?: string | null;
  birth_date: string;
  weight?: number | string | null;
  sex?: string | null;
  microchipped: boolean;
  neutered: boolean;
  behavior?: string | null;
  conditions?: string | null;
  avatar_url?: string | null;
  user_id: string;
  owner_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_cpf: string | null;
  owner_address: string | null;
}

const route = useRoute();
const { api } = useApi();
const config = useRuntimeConfig();

const pet = ref<AdminPetDetail | null>(null);
const pending = ref(true);
const errorMsg = ref('');

const uploadsBase = computed(() => config.public.apiBase.replace(/\/api\/?$/, ''));

function avatarSrc(avatarUrl?: string | null) {
  if (!avatarUrl) return null;
  return `${uploadsBase.value}${avatarUrl}`;
}

// speciesIcon e speciesLabel vêm do composable useSpecies (auto-import)

function petAge(birthDate?: string) {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

onMounted(async () => {
  try {
    pet.value = await api<AdminPetDetail>(`/admin/pets/${route.params.id}`);
  } catch {
    errorMsg.value = 'Erro ao carregar pet.';
  } finally {
    pending.value = false;
  }
});
</script>

<template>
  <div class="max-w-4xl">
    <NuxtLink to="/painel/adm/pets" class="text-sm text-accent hover:underline flex items-center gap-1">
      <UIcon name="i-heroicons-arrow-left" class="size-4" /> Voltar para a lista
    </NuxtLink>

    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" class="mt-6" />

    <div v-else-if="pending" class="mt-6 bg-white rounded-xl shadow p-8 animate-pulse h-64" />

    <div v-else-if="pet" class="mt-6 bg-white rounded-xl shadow p-8 flex flex-col gap-6">
      <div class="flex items-center gap-6">
        <div class="size-24 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center border-4 border-accent/20">
          <img v-if="avatarSrc(pet.avatar_url)" :src="avatarSrc(pet.avatar_url)!" class="w-full h-full object-cover" />
          <UIcon v-else :name="speciesIcon(pet.species)" class="text-accent size-12" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ pet.name }}</h1>
          <p class="text-sm text-gray-500">{{ speciesLabel(pet.species) }} · {{ pet.breed }}</p>
          <p class="text-sm text-gray-500">{{ petAge(pet.birth_date) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Porte</p>
          <p class="font-medium capitalize">{{ pet.size }}</p>
        </div>
        <div>
          <p class="text-gray-500">Pelagem</p>
          <p class="font-medium">{{ pet.coat }}</p>
        </div>
        <div>
          <p class="text-gray-500">Cor da pelagem</p>
          <p class="font-medium">{{ pet.coat_color || '—' }}</p>
        </div>
        <div>
          <p class="text-gray-500">Sexo</p>
          <p class="font-medium">{{ sexLabel(pet.sex) }}</p>
        </div>
        <div>
          <p class="text-gray-500">Peso</p>
          <p class="font-medium">{{ pet.weight ? `${pet.weight} kg` : '—' }}</p>
        </div>
        <div>
          <p class="text-gray-500">Microchipado</p>
          <p class="font-medium">{{ pet.microchipped ? 'Sim' : 'Não' }}</p>
        </div>
        <div>
          <p class="text-gray-500">Castrado</p>
          <p class="font-medium">{{ pet.neutered ? 'Sim' : 'Não' }}</p>
        </div>
        <div>
          <p class="text-gray-500">Nascimento</p>
          <p class="font-medium">{{ pet.birth_date?.slice(0, 10) }}</p>
        </div>
      </div>

      <div v-if="pet.behavior">
        <p class="text-gray-500 text-sm">Comportamento</p>
        <p class="text-gray-800 mt-1">{{ pet.behavior }}</p>
      </div>
      <div v-if="pet.conditions">
        <p class="text-gray-500 text-sm">Condições</p>
        <p class="text-gray-800 mt-1">{{ pet.conditions }}</p>
      </div>

      <div class="border-t border-gray-100 pt-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Responsável</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-gray-500">Nome</p>
            <p class="font-medium">{{ pet.owner_name || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-500">E-mail</p>
            <p class="font-medium">{{ pet.owner_email || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-500">CPF</p>
            <p class="font-medium">{{ pet.owner_cpf || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-500">Endereço</p>
            <p class="font-medium">{{ pet.owner_address || '—' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
