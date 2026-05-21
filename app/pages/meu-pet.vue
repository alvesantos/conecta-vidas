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

const uploadsBase = computed(() => config.public.apiBase.replace(/\/api\/?$/, ''));

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
  return species === 'gato' ? 'i-mdi-cat' : 'i-mdi-dog';
}

function speciesLabel(species: string) {
  return species === 'gato' ? 'Gato' : 'Cachorro';
}

async function loadPets() {
  pending.value = true;
  try {
    pets.value = await api<Pet[]>('/pets/me');
  } catch {
    fetchError.value = 'Não foi possível carregar seus pets. Tente novamente.';
  } finally {
    pending.value = false;
  }
}

// --- Modal de edição ---
const editOpen = ref(false);
const editTarget = ref<Pet | null>(null);
const editSaving = ref(false);
const editError = ref('');
const editForm = reactive({
  name: '',
  species: '',
  breed: '',
  size: '',
  coat: '',
  birth_date: '',
  microchipped: false,
  neutered: false,
  behavior: '',
  conditions: '',
});

function openEdit(pet: Pet) {
  editTarget.value = pet;
  editForm.name = pet.name;
  editForm.species = pet.species;
  editForm.breed = pet.breed;
  editForm.size = pet.size;
  editForm.coat = pet.coat;
  editForm.birth_date = pet.birth_date?.slice(0, 10) ?? '';
  editForm.microchipped = pet.microchipped;
  editForm.neutered = pet.neutered;
  editForm.behavior = pet.behavior ?? '';
  editForm.conditions = pet.conditions ?? '';
  editError.value = '';
  editOpen.value = true;
}

async function saveEdit() {
  if (!editTarget.value) return;
  editSaving.value = true;
  editError.value = '';
  try {
    await api(`/pets/${editTarget.value.id}`, {
      method: 'PUT',
      body: { ...editForm },
    });
    editOpen.value = false;
    await loadPets();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    editError.value = fetchErr?.data?.error ?? 'Erro ao salvar pet.';
  } finally {
    editSaving.value = false;
  }
}

onMounted(loadPets);
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Meus Pets</h1>
      <p class="text-gray-500 text-sm mt-1">Veja e edite as informações dos seus companheiros</p>
    </div>

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

    <UAlert
      v-else-if="fetchError"
      color="error"
      variant="soft"
      :description="fetchError"
      icon="i-heroicons-exclamation-circle"
    />

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

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="pet in pets"
        :key="pet.id"
        class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center gap-4"
      >
        <div class="relative">
          <div
            v-if="avatarSrc(pet.avatar_url)"
            class="w-28 h-28 rounded-full overflow-hidden border-4 border-accent/30 shadow"
          >
            <img :src="avatarSrc(pet.avatar_url)!" :alt="pet.name" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-28 h-28 rounded-full bg-accent/10 border-4 border-accent/20 flex items-center justify-center"
          >
            <UIcon :name="speciesIcon(pet.species)" class="text-accent text-5xl" />
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-800 text-center leading-tight">{{ pet.name }}</h2>

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

        <span class="text-xs bg-accent/10 text-accent font-medium px-3 py-1 rounded-full">
          {{ pet.breed }}
        </span>

        <UButton
          label="Editar"
          size="sm"
          variant="outline"
          color="primary"
          icon="i-heroicons-pencil-square"
          @click="openEdit(pet)"
        />
      </div>
    </div>

    <!-- Modal Editar -->
    <UModal v-model:open="editOpen" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <div class="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-800">Editar {{ editTarget?.name }}</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Nome">
              <UInput v-model="editForm.name" />
            </UFormField>
            <UFormField label="Espécie">
              <USelect
                v-model="editForm.species"
                :items="[
                  { label: 'Cachorro', value: 'cachorro' },
                  { label: 'Gato', value: 'gato' },
                ]"
              />
            </UFormField>
            <UFormField label="Raça">
              <UInput v-model="editForm.breed" />
            </UFormField>
            <UFormField label="Porte">
              <USelect
                v-model="editForm.size"
                :items="[
                  { label: 'Pequeno', value: 'pequeno' },
                  { label: 'Médio', value: 'medio' },
                  { label: 'Grande', value: 'grande' },
                  { label: 'Gigante', value: 'gigante' },
                ]"
              />
            </UFormField>
            <UFormField label="Pelagem">
              <UInput v-model="editForm.coat" />
            </UFormField>
            <UFormField label="Nascimento">
              <UInput v-model="editForm.birth_date" type="date" />
            </UFormField>
          </div>

          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="editForm.microchipped" />
              <span class="text-sm">Microchipado</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="editForm.neutered" />
              <span class="text-sm">Castrado</span>
            </label>
          </div>

          <UFormField label="Comportamento">
            <UTextarea v-model="editForm.behavior" :rows="2" />
          </UFormField>
          <UFormField label="Condições / Doenças">
            <UTextarea v-model="editForm.conditions" :rows="2" />
          </UFormField>

          <UAlert v-if="editError" color="error" variant="soft" :description="editError" />

          <div class="flex justify-end gap-2 mt-2">
            <UButton variant="outline" label="Cancelar" @click="editOpen = false" />
            <UButton color="primary" label="Salvar" :loading="editSaving" @click="saveEdit" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
