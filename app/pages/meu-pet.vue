<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  size: string;
  coat: string;
  birth_date: string;
  microchipped: boolean;
  neutered: boolean;
  behavior?: string;
  conditions?: string;
  avatar_url?: string;
}

const { api } = useApi();
const config = useRuntimeConfig();

const pets = ref<Pet[]>([]);
const pending = ref(true);
const fetchError = ref('');

// Base para montar URLs das imagens (retira o "/api" do final do apiBase)
const uploadsBase = computed(() =>
  config.public.apiBase.replace(/\/api\/?$/, '')
);

function avatarSrc(avatarUrl?: string) {
  if (!avatarUrl) return null;
  return `${uploadsBase.value}${avatarUrl}`;
}

function petAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

function speciesIcon(species: string) {
  if (species === 'gato') return 'i-mdi-cat';
  return 'i-mdi-dog';
}

function speciesLabel(species: string) {
  if (species === 'gato') return 'Gato';
  return 'Cachorro';
}

onMounted(async () => {
  try {
    pets.value = await api<Pet[]>('/pets/my');
  } catch {
    fetchError.value = 'Não foi possível carregar seus pets. Tente novamente.';
  } finally {
    pending.value = false;
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Meus Pets</h1>
      <p class="text-gray-500 text-sm mt-1">Veja as informações dos seus companheiros</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 2"
        :key="i"
        class="bg-white rounded-2xl shadow p-8 flex flex-col items-center gap-4 animate-pulse"
      >
        <div class="w-28 h-28 rounded-full bg-gray-200" />
        <div class="h-5 w-32 bg-gray-200 rounded" />
        <div class="h-4 w-20 bg-gray-100 rounded" />
      </div>
    </div>

    <!-- Erro -->
    <UAlert
      v-else-if="fetchError"
      color="error"
      variant="soft"
      :description="fetchError"
      icon="i-heroicons-exclamation-circle"
    />

    <!-- Sem pets -->
    <div
      v-else-if="pets.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <div class="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
        <UIcon name="i-mdi-paw" class="text-accent text-4xl" />
      </div>
      <div>
        <p class="text-gray-700 font-medium text-lg">Nenhum pet cadastrado ainda</p>
        <p class="text-gray-400 text-sm mt-1">Cadastre seu pet para acessar o perfil aqui.</p>
      </div>
      <UButton
        to="/cadastro"
        label="Cadastrar pet"
        size="lg"
        class="bg-accent text-white mt-2"
        leading-icon="i-heroicons-plus"
      />
    </div>

    <!-- Cards dos pets -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="pet in pets"
        :key="pet.id"
        class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center gap-4"
      >
        <!-- Avatar -->
        <div class="relative">
          <div
            v-if="avatarSrc(pet.avatar_url)"
            class="w-28 h-28 rounded-full overflow-hidden border-4 border-accent/30 shadow"
          >
            <img
              :src="avatarSrc(pet.avatar_url)!"
              :alt="pet.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-28 h-28 rounded-full bg-accent/10 border-4 border-accent/20 flex items-center justify-center"
          >
            <UIcon
              :name="speciesIcon(pet.species)"
              class="text-accent text-5xl"
            />
          </div>
        </div>

        <!-- Nome -->
        <h2 class="text-xl font-bold text-gray-800 text-center leading-tight">
          {{ pet.name }}
        </h2>

        <!-- Espécie + Idade -->
        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center gap-1.5 text-gray-500 text-sm">
            <UIcon :name="speciesIcon(pet.species)" class="text-accent text-base shrink-0" />
            <span>{{ speciesLabel(pet.species) }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500 text-sm">
            <UIcon name="i-heroicons-cake" class="text-accent text-base shrink-0" />
            <span>{{ petAge(pet.birth_date) }}</span>
          </div>
        </div>

        <!-- Badge raça -->
        <span class="text-xs bg-accent/10 text-accent font-medium px-3 py-1 rounded-full">
          {{ pet.breed }}
        </span>
      </div>
    </div>
  </div>
</template>
