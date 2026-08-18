<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'veterinario' });

interface Responsible {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  address: string | null;
}

interface Animal {
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
}

const { api } = useApi();
const { user } = useAuth();
const router = useRouter();

const responsibles = ref<Responsible[]>([]);
const animals = ref<Animal[]>([]);
const loadingResponsibles = ref(true);
const loadingAnimals = ref(false);

const selectedResponsibleId = ref<string>('');
const selectedAnimalId = ref<string>('');
const content = ref('');
const date = ref(new Date().toISOString().slice(0, 10));

const errorMsg = ref('');
const showPreview = ref(false);
const saving = ref(false);
const saved = ref(false);

const selectedResponsible = computed(
  () => responsibles.value.find((r) => r.id === selectedResponsibleId.value) ?? null,
);
const selectedAnimal = computed(
  () => animals.value.find((a) => a.id === selectedAnimalId.value) ?? null,
);

const responsibleItems = computed(() =>
  responsibles.value.map((r) => ({ label: r.name, value: r.id })),
);
const animalItems = computed(() =>
  animals.value.map((a) => ({ label: `${a.name} (${speciesLabel(a.species)})`, value: a.id })),
);

async function loadResponsibles() {
  loadingResponsibles.value = true;
  try {
    responsibles.value = await api<Responsible[]>('/vet/responsibles');
  } catch {
    errorMsg.value = 'Erro ao carregar responsáveis.';
  } finally {
    loadingResponsibles.value = false;
  }
}

async function loadAnimals(responsibleId: string) {
  loadingAnimals.value = true;
  animals.value = [];
  selectedAnimalId.value = '';
  try {
    animals.value = await api<Animal[]>(`/vet/responsibles/${responsibleId}/pets`);
  } catch {
    errorMsg.value = 'Erro ao carregar os pets.';
  } finally {
    loadingAnimals.value = false;
  }
}

watch(selectedResponsibleId, (id) => {
  showPreview.value = false;
  saved.value = false;
  if (id) loadAnimals(id);
  else animals.value = [];
});

onMounted(loadResponsibles);

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function petAge(birthDate?: string) {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

const todayFormatted = computed(() => formatDate(new Date().toISOString().slice(0, 10)));

function openPreview() {
  errorMsg.value = '';
  if (!selectedResponsibleId.value) {
    errorMsg.value = 'Selecione um responsável.';
    return;
  }
  if (!content.value.trim()) {
    errorMsg.value = 'Escreva a prescrição.';
    return;
  }
  showPreview.value = true;
  nextTick(() => {
    document.getElementById('prescription-document')?.scrollIntoView({ behavior: 'smooth' });
  });
}

async function savePrescription() {
  saving.value = true;
  errorMsg.value = '';
  try {
    await api('/vet/prescriptions', {
      method: 'POST',
      body: {
        user_id: selectedResponsibleId.value,
        pet_id: selectedAnimalId.value || undefined,
        content: content.value,
        date: date.value,
      },
    });
    saved.value = true;
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    errorMsg.value = fetchErr?.data?.error ?? 'Erro ao salvar prescrição.';
  } finally {
    saving.value = false;
  }
}

const downloading = ref(false);

async function downloadPdf() {
  downloading.value = true;
  try {
    await downloadPrescriptionPdf({
      vetName: user.value?.name,
      vetCrmv: user.value?.crmv,
      date: date.value,
      content: content.value,
      responsibleName: selectedResponsible.value?.name,
      responsibleCpf: selectedResponsible.value?.cpf,
      responsibleEmail: selectedResponsible.value?.email,
      responsibleAddress: selectedResponsible.value?.address,
      animal: selectedAnimal.value
        ? {
            name: selectedAnimal.value.name,
            species: selectedAnimal.value.species,
            breed: selectedAnimal.value.breed,
            sex: selectedAnimal.value.sex,
            size: selectedAnimal.value.size,
            weight: selectedAnimal.value.weight,
            coat: selectedAnimal.value.coat,
            coatColor: selectedAnimal.value.coat_color,
            birthDate: selectedAnimal.value.birth_date,
          }
        : null,
    });
  } catch {
    errorMsg.value = 'Erro ao gerar o PDF.';
  } finally {
    downloading.value = false;
  }
}
</script>

<template>
  <div>
    <NuxtLink
      to="/painel/veterinario/prescricoes"
      class="text-sm text-accent hover:underline flex items-center gap-1 mb-4"
    >
      <UIcon name="i-heroicons-arrow-left" class="size-4" /> Voltar para prescrições
    </NuxtLink>

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Nova Prescrição</h1>
      <p class="text-gray-500 text-sm mt-1">
        Selecione o responsável, o animal e escreva a prescrição.
      </p>
    </div>

    <div class="bg-white rounded-xl shadow p-6 flex flex-col gap-5">
      <!-- Responsável -->
      <UFormField label="Responsável">
        <USelect
          v-model="selectedResponsibleId"
          :items="responsibleItems"
          :loading="loadingResponsibles"
          placeholder="Selecione o responsável"
          icon="i-heroicons-user"
          class="w-full"
        />
      </UFormField>

      <!-- Animal -->
      <div v-if="selectedResponsibleId">
        <div v-if="loadingAnimals" class="text-sm text-gray-400">Carregando pets...</div>
        <UFormField v-else-if="animals.length > 0" label="Pet">
          <USelect
            v-model="selectedAnimalId"
            :items="animalItems"
            placeholder="Selecione o pet"
            icon="i-heroicons-heart"
            class="w-full"
          />
        </UFormField>
        <div
          v-else
          class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3"
        >
          Sem animais cadastrados para esse responsável.
        </div>
      </div>

      <!-- Prescrição -->
      <UFormField label="Prescrição">
        <UTextarea
          v-model="content"
          :rows="8"
          placeholder="Descreva a prescrição, medicamentos, dosagens e instruções..."
          class="w-full"
        />
      </UFormField>

      <!-- Data -->
      <UFormField label="Data da Prescrição">
        <UInput v-model="date" type="date" class="w-full md:w-60" />
      </UFormField>

      <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg" />

      <div class="flex justify-end">
        <UButton
          label="Pré-visualizar"
          icon="i-heroicons-eye"
          color="primary"

          @click="openPreview"
        />
      </div>
    </div>

    <!-- Pré-visualização (PDF Viewer) -->
    <div v-if="showPreview" class="mt-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-800">Pré-visualização</h2>
        <div class="flex gap-2">
          <UButton
            label="Baixar PDF"
            icon="i-heroicons-arrow-down-tray"
            variant="outline"
            color="primary"

            :loading="downloading"
            @click="downloadPdf"
          />
          <UButton
            :label="saved ? 'Salva ✓' : 'Salvar prescrição'"
            icon="i-heroicons-check"
            color="primary"

            :loading="saving"
            :disabled="saved"
            @click="savePrescription"
          />
        </div>
      </div>

      <!-- "Folha" estilo PDF — sempre fundo branco pois simula papel -->
      <div class="bg-gray-200 p-4 md:p-8 rounded-xl overflow-x-auto">
        <div
          id="prescription-document"
          class="bg-white mx-auto shadow-lg"
          style="width: 100%; max-width: 794px; min-height: 1000px; padding: 48px;"
        >
          <!-- Cabeçalho com logo à direita -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 24px;">
            <div>
              <h1 style="font-size: 22px; font-weight: 700; color: #0d9488; margin: 0;">Prescrição Veterinária</h1>
              <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">ConectaVidas</p>
            </div>
            <img
              src="/conecta-icon.png"
              alt="ConectaVidas"
              style="height: 80px; width: auto; object-fit: contain;"
            />
          </div>

          <!-- Dados do Pet -->
          <h2 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 8px;">Dados do Pet</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; font-size: 13px; color: #374151; margin-bottom: 20px;">
            <template v-if="selectedAnimal">
              <div><strong>Nome:</strong> {{ selectedAnimal.name }}</div>
              <div><strong>Espécie:</strong> {{ speciesLabel(selectedAnimal.species) }}</div>
              <div><strong>Raça:</strong> {{ selectedAnimal.breed }}</div>
              <div><strong>Sexo:</strong> {{ sexLabel(selectedAnimal.sex) }}</div>
              <div><strong>Porte:</strong> <span style="text-transform: capitalize;">{{ selectedAnimal.size }}</span></div>
              <div><strong>Peso:</strong> {{ selectedAnimal.weight ? `${selectedAnimal.weight} kg` : '—' }}</div>
              <div><strong>Pelagem:</strong> {{ selectedAnimal.coat }}<span v-if="selectedAnimal.coat_color"> ({{ selectedAnimal.coat_color }})</span></div>
              <div><strong>Idade:</strong> {{ petAge(selectedAnimal.birth_date) }}</div>
            </template>
            <div v-else>Nenhum animal selecionado.</div>
          </div>

          <!-- Dados do Responsável -->
          <h2 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 8px;">Dados do Responsável</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; font-size: 13px; color: #374151; margin-bottom: 20px;">
            <div><strong>Nome:</strong> {{ selectedResponsible?.name }}</div>
            <div><strong>CPF:</strong> {{ selectedResponsible?.cpf || '—' }}</div>
            <div><strong>E-mail:</strong> {{ selectedResponsible?.email || '—' }}</div>
            <div><strong>Endereço:</strong> {{ selectedResponsible?.address || '—' }}</div>
          </div>

          <!-- Instruções Gerais do Tratamento -->
          <h6 style="font-size: 15px; font-weight: 700; color: #0d9488; margin: 24px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">
            Instruções Gerais do Tratamento
          </h6>
          <div style="font-size: 14px; color: #1f2937; white-space: pre-wrap; line-height: 1.6; min-height: 200px;">{{ content }}</div>

          <!-- Assinatura -->
          <div style="margin-top: 64px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 13px; color: #374151; line-height: 1.5;">
              <strong>{{ user?.name }}</strong><br />
              <template v-if="user?.crmv">CRMV: {{ user.crmv }}<br /></template>
              <span style="font-size: 11px; color: #6b7280;">Médico(a) Veterinário(a)</span>
            </div>
            <div style="font-size: 13px; color: #374151;">
              {{ todayFormatted }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
