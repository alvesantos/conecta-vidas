<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'cliente' });

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  size?: string | null;
  coat?: string | null;
  coat_color?: string;
  birth_date: string;
  weight?: number | string | null;
  sex?: string | null;
  microchipped: boolean;
  neutered: boolean;
  behavior?: string;
  conditions?: string;
  avatar_url?: string;
}

const { api } = useApi();
const config = useRuntimeConfig();

const PET_LIMIT = 5;

const pets = ref<Pet[]>([]);
const pending = ref(true);
const fetchError = ref('');

const canAddPet = computed(() => pets.value.length < PET_LIMIT);

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

// speciesIcon, speciesLabel, speciesOptions, sexOptions e sexLabel vêm do composable useSpecies (auto-import)

async function loadPets() {
  pending.value = true;
  try {
    pets.value = await api<Pet[]>('/pets/me');
  } catch {
    fetchError.value = 'Não foi possível carregar seus animais. Tente novamente.';
  } finally {
    pending.value = false;
  }
}

// --- Modal de criação / edição ---
const modalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('edit');
const editTarget = ref<Pet | null>(null);
const saving = ref(false);
const deletingId = ref<string | null>(null);
const formError = ref('');
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const sizeOptions = [
  { label: 'Pequeno', value: 'pequeno' },
  { label: 'Médio', value: 'medio' },
  { label: 'Grande', value: 'grande' },
  { label: 'Gigante', value: 'gigante' },
];

const form = reactive({
  name: '',
  species: '',
  breed: '',
  size: '',
  coat: '',
  coat_color: '',
  birth_date: '',
  weight: '',
  sex: '',
  microchipped: false,
  neutered: false,
  behavior: '',
  conditions: '',
});

function resetForm() {
  form.name = '';
  form.species = '';
  form.breed = '';
  form.size = '';
  form.coat = '';
  form.coat_color = '';
  form.birth_date = '';
  form.weight = '';
  form.sex = '';
  form.microchipped = false;
  form.neutered = false;
  form.behavior = '';
  form.conditions = '';
}

function openCreate() {
  modalMode.value = 'create';
  editTarget.value = null;
  resetForm();
  avatarFile.value = null;
  avatarPreview.value = null;
  if (fileInput.value) fileInput.value.value = '';
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(pet: Pet) {
  modalMode.value = 'edit';
  editTarget.value = pet;
  form.name = pet.name;
  form.species = pet.species;
  form.breed = pet.breed;
  form.size = pet.size ?? '';
  form.coat = pet.coat ?? '';
  form.coat_color = pet.coat_color ?? '';
  form.birth_date = pet.birth_date?.slice(0, 10) ?? '';
  form.weight = pet.weight != null ? String(pet.weight) : '';
  form.sex = pet.sex ?? '';
  form.microchipped = pet.microchipped;
  form.neutered = pet.neutered;
  form.behavior = pet.behavior ?? '';
  form.conditions = pet.conditions ?? '';
  avatarFile.value = null;
  avatarPreview.value = avatarSrc(pet.avatar_url);
  if (fileInput.value) fileInput.value.value = '';
  formError.value = '';
  modalOpen.value = true;
}

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  avatarFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function validate() {
  const required: Array<[keyof typeof form, string]> = [
    ['name', 'Nome'],
    ['species', 'Espécie'],
    ['breed', 'Raça'],
    ['size', 'Porte'],
    ['coat', 'Pelagem'],
    ['birth_date', 'Data de nascimento'],
  ];
  for (const [key, label] of required) {
    if (!String(form[key]).trim()) {
      formError.value = `${label} é obrigatório.`;
      return false;
    }
  }
  return true;
}

async function savePet() {
  if (!validate()) return;
  saving.value = true;
  formError.value = '';
  try {
    let body: FormData | typeof form;
    if (avatarFile.value) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, String(value));
      }
      formData.append('avatar', avatarFile.value);
      body = formData;
    } else {
      body = { ...form };
    }

    if (modalMode.value === 'create') {
      await api('/pets', { method: 'POST', body });
    } else if (editTarget.value) {
      await api(`/pets/${editTarget.value.id}`, { method: 'PUT', body });
    }

    modalOpen.value = false;
    await loadPets();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    formError.value = fetchErr?.data?.error ?? 'Erro ao salvar animal.';
  } finally {
    saving.value = false;
  }
}

async function deletePet(pet: Pet) {
  if (!window.confirm(`Excluir o perfil de ${pet.name}? O histórico clínico será preservado.`)) return;

  deletingId.value = pet.id;
  fetchError.value = '';
  try {
    await api(`/pets/${pet.id}`, { method: 'DELETE' });
    await loadPets();
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    fetchError.value = fetchErr?.data?.error ?? 'Não foi possível excluir o animal.';
  } finally {
    deletingId.value = null;
  }
}

onMounted(loadPets);
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Meus Animais</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Veja e edite as informações dos seus companheiros</p>
      </div>
      <div v-if="!pending && !fetchError && pets.length > 0" class="flex flex-col items-end gap-1">
        <UButton
          label="Adicionar animal"
          icon="i-heroicons-plus"
          class="bg-accent text-white"
          :disabled="!canAddPet"
          @click="openCreate"
        />
        <span v-if="!canAddPet" class="text-xs text-gray-400 dark:text-gray-500">
          Limite de {{ PET_LIMIT }} animais atingido
        </span>
      </div>
    </div>

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 2"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 flex flex-col items-center gap-4 animate-pulse"
      >
        <div class="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
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
        <p class="text-gray-700 dark:text-gray-200 font-medium text-lg">Nenhum animal cadastrado ainda</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Cadastre seu animal para acessar o perfil aqui.</p>
      </div>
      <UButton
        label="Cadastrar animal"
        size="lg"
        class="bg-accent text-white mt-2"
        leading-icon="i-heroicons-plus"
        @click="openCreate"
      />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="pet in pets"
        :key="pet.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center gap-4"
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

        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 text-center leading-tight">{{ pet.name }}</h2>

        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
            <UIcon :name="speciesIcon(pet.species)" class="text-accent text-base shrink-0" />
            <span>{{ speciesLabel(pet.species) }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
            <UIcon name="i-heroicons-cake" class="text-accent text-base shrink-0" />
            <span>{{ petAge(pet.birth_date) }}</span>
          </div>
        </div>

        <span class="text-xs bg-accent/10 text-accent font-medium px-3 py-1 rounded-full">
          {{ pet.breed }}
        </span>

        <div class="flex gap-2">
          <UButton
            label="Editar"
            size="sm"
            variant="outline"
            color="primary"
            icon="i-heroicons-pencil-square"
            @click="openEdit(pet)"
          />
          <UButton
            label="Excluir"
            size="sm"
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            :loading="deletingId === pet.id"
            @click="deletePet(pet)"
          />
        </div>
      </div>
    </div>

    <!-- Modal Criar / Editar -->
    <UModal v-model:open="modalOpen" :ui="{ content: 'w-full max-w-full md:w-[70vw] md:max-w-[70vw]' }">
      <template #content>
        <div class="flex flex-col max-h-[90vh]">
          <!-- Header fixo com título e botão X -->
          <div class="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {{ modalMode === 'create' ? 'Adicionar animal' : `Editar ${editTarget?.name}` }}
            </h3>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="neutral"
              size="md"
              @click="modalOpen = false"
            />
          </div>

          <!-- Conteúdo scrollável -->
          <div class="px-8 py-6 flex flex-col gap-5 overflow-y-auto flex-1">

          <!-- Foto do pet -->
          <div class="flex flex-col items-center gap-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="hidden"
              @change="onAvatarChange"
            />
            <div class="relative cursor-pointer group" @click="fileInput?.click()">
              <div
                v-if="avatarPreview"
                class="w-24 h-24 rounded-full overflow-hidden border-4 border-accent/30 shadow"
              >
                <img :src="avatarPreview" alt="Foto do animal" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-1 group-hover:border-accent group-hover:bg-accent/5 transition-colors"
              >
                <UIcon name="i-heroicons-camera" class="text-gray-400 dark:text-gray-500 text-2xl group-hover:text-accent" />
              </div>
              <div
                class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <UIcon name="i-heroicons-camera" class="text-white text-2xl" />
              </div>
            </div>
            <span class="text-xs text-gray-400 dark:text-gray-500">Clique para {{ modalMode === 'create' ? 'adicionar' : 'alterar' }} a foto</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Nome">
              <UInput v-model="form.name" class="w-full" />
            </UFormField>
            <UFormField label="Espécie">
              <USelect v-model="form.species" :items="speciesOptions" class="w-full" />
            </UFormField>
            <UFormField label="Raça">
              <UInput v-model="form.breed" class="w-full" />
            </UFormField>
            <UFormField label="Porte">
              <USelect v-model="form.size" :items="sizeOptions" class="w-full" />
            </UFormField>
            <UFormField label="Pelagem">
              <UInput v-model="form.coat" class="w-full" />
            </UFormField>
            <UFormField label="Cor da pelagem">
              <UInput v-model="form.coat_color" placeholder="ex: preto, caramelo, tricolor" class="w-full" />
            </UFormField>
            <UFormField label="Sexo">
              <USelect v-model="form.sex" :items="sexOptions" placeholder="Selecione" class="w-full" />
            </UFormField>
            <UFormField label="Peso (kg)">
              <UInput v-model="form.weight" type="number" step="0.1" min="0" placeholder="ex: 12.5" class="w-full" />
            </UFormField>
            <UFormField label="Nascimento">
              <UInput v-model="form.birth_date" type="date" class="w-full" />
            </UFormField>
          </div>

          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="form.microchipped" />
              <span class="text-sm">Microchipado</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="form.neutered" />
              <span class="text-sm">Castrado</span>
            </label>
          </div>

          <UFormField label="Comportamento">
            <UTextarea v-model="form.behavior" :rows="2" class="w-full" />
          </UFormField>
          <UFormField label="Condições / Doenças">
            <UTextarea v-model="form.conditions" :rows="2" class="w-full" />
          </UFormField>

          <UAlert v-if="formError" color="error" variant="soft" :description="formError" />

          <div class="flex justify-end gap-3 pt-2">
            <UButton size="lg" variant="outline" label="Cancelar" class="dark:text-white" @click="modalOpen = false" />
            <UButton
              size="lg"
              color="primary"
              class="dark:text-white"
              :label="modalMode === 'create' ? 'Adicionar' : 'Salvar'"
              :loading="saving"
              @click="savePet"
            />
          </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
