<script setup lang="ts">
definePageMeta({ noPadding: true });
import { vMaska } from "maska/vue";

const { api } = useApi();
const router = useRouter();

const currentStep = ref(1);
const loading = ref(false);
const apiError = ref("");

// Tutor
const tutorName = ref("");
const tutorCpf = ref("");
const tutorEmail = ref("");
const tutorAddress = ref("");
const tutorPassword = ref("");
const tutorConfirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Pet
const petName = ref("");
const petSpecies = ref("");
const petBreed = ref("");
const petSize = ref("");
const petCoat = ref("");
const petBirthDate = ref("");
const petMicrochipped = ref("");
const petNeutered = ref("");
const petBehavior = ref("");
const petConditions = ref("");

// Errors
const errors = reactive<Record<string, string>>({});

function setError(field: string, msg: string) {
  errors[field] = msg;
}
function clearError(field: string) {
  delete errors[field];
}

const speciesOptions = [
  { label: "Cão", value: "cao" },
  { label: "Gato", value: "gato" },
  { label: "Pássaro", value: "passaro" },
  { label: "Réptil", value: "reptil" },
  { label: "Roedor", value: "roedor" },
  { label: "Outro", value: "outro" },
];

const sizeOptions = [
  { label: "Pequeno", value: "pequeno" },
  { label: "Médio", value: "medio" },
  { label: "Grande", value: "grande" },
  { label: "Gigante", value: "gigante" },
];

const booleanOptions = [
  { label: "Sim", value: "sim" },
  { label: "Não", value: "nao" },
];

const petAge = computed(() => {
  if (!petBirthDate.value) return "";
  const birth = new Date(petBirthDate.value);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "ano" : "anos"}`;
});

function validateStep1() {
  let valid = true;

  if (!tutorName.value.trim()) {
    setError("tutorName", "Nome obrigatório");
    valid = false;
  } else clearError("tutorName");

  if (tutorCpf.value.length < 14) {
    setError("tutorCpf", "CPF inválido");
    valid = false;
  } else clearError("tutorCpf");

  if (!tutorEmail.value.trim()) {
    setError("tutorEmail", "E-mail obrigatório");
    valid = false;
  } else clearError("tutorEmail");

  if (!tutorPassword.value) {
    setError("tutorPassword", "Senha obrigatória");
    valid = false;
  } else clearError("tutorPassword");

  if (!tutorConfirmPassword.value) {
    setError("tutorConfirmPassword", "Confirmação obrigatória");
    valid = false;
  } else if (tutorPassword.value !== tutorConfirmPassword.value) {
    setError("tutorConfirmPassword", "As senhas não coincidem");
    valid = false;
  } else clearError("tutorConfirmPassword");

  return valid;
}

function validateStep2() {
  let valid = true;

  if (!petName.value.trim()) {
    setError("petName", "Nome do pet obrigatório");
    valid = false;
  } else clearError("petName");

  if (!petSpecies.value) {
    setError("petSpecies", "Espécie obrigatória");
    valid = false;
  } else clearError("petSpecies");

  if (!petBreed.value.trim()) {
    setError("petBreed", "Raça obrigatória");
    valid = false;
  } else clearError("petBreed");

  if (!petSize.value) {
    setError("petSize", "Porte obrigatório");
    valid = false;
  } else clearError("petSize");

  if (!petCoat.value.trim()) {
    setError("petCoat", "Pelagem obrigatória");
    valid = false;
  } else clearError("petCoat");

  if (!petBirthDate.value) {
    setError("petBirthDate", "Data de nascimento obrigatória");
    valid = false;
  } else clearError("petBirthDate");

  if (!petMicrochipped.value) {
    setError("petMicrochipped", "Campo obrigatório");
    valid = false;
  } else clearError("petMicrochipped");

  if (!petNeutered.value) {
    setError("petNeutered", "Campo obrigatório");
    valid = false;
  } else clearError("petNeutered");

  return valid;
}

function goToStep2() {
  if (validateStep1()) currentStep.value = 2;
}

async function submit() {
  if (!validateStep2()) return;

  loading.value = true;
  apiError.value = "";

  try {
    const tutor = await api<{ id: string }>("/tutors", {
      method: "POST",
      body: {
        name: tutorName.value,
        cpf: tutorCpf.value,
        email: tutorEmail.value,
        address: tutorAddress.value || undefined,
        password: tutorPassword.value,
      },
    });

    await api("/pets", {
      method: "POST",
      body: {
        tutor_id: tutor.id,
        name: petName.value,
        species: petSpecies.value,
        breed: petBreed.value,
        size: petSize.value,
        coat: petCoat.value,
        birth_date: petBirthDate.value,
        microchipped: petMicrochipped.value === "sim",
        neutered: petNeutered.value === "sim",
        behavior: petBehavior.value || undefined,
        conditions: petConditions.value || undefined,
      },
    });

    await router.push("/login");
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } };
    apiError.value =
      fetchErr?.data?.error ?? "Erro ao criar conta. Tente novamente.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-10">
    <div
      class="w-full max-w-xl bg-white rounded-2xl shadow-lg p-14 flex flex-col gap-8"
    >
      <!-- Logo -->
      <div class="flex flex-col items-center gap-2">
        <img src="/icon-com-texto.png" alt="Conecta Vet" class="h-40" />
        <p class="text-sm text-gray-500">Crie sua conta de tutor</p>
      </div>

      <!-- Steps indicator -->
      <div class="flex items-center gap-0">
        <div class="flex flex-col items-center gap-1 flex-1">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
            :class="
              currentStep >= 1
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-400'
            "
          >
            1
          </div>
          <span
            class="text-xs font-medium"
            :class="currentStep >= 1 ? 'text-accent' : 'text-gray-400'"
            >Tutor</span
          >
        </div>

        <div
          class="h-px flex-1 mb-5 transition-colors"
          :class="currentStep >= 2 ? 'bg-accent' : 'bg-gray-200'"
        />

        <div class="flex flex-col items-center gap-1 flex-1">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
            :class="
              currentStep >= 2
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-400'
            "
          >
            2
          </div>
          <span
            class="text-xs font-medium"
            :class="currentStep >= 2 ? 'text-accent' : 'text-gray-400'"
            >Pet</span
          >
        </div>
      </div>

      <!-- Step 1: Tutor -->
      <div v-if="currentStep === 1" class="flex flex-col gap-4">
        <UFormField :error="errors.tutorName">
          <UInput
            v-model="tutorName"
            type="text"
            placeholder="Nome completo *"
            size="lg"
            icon="i-heroicons-user"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.tutorCpf">
          <UInput
            v-model="tutorCpf"
            v-maska="'###.###.###-##'"
            type="text"
            placeholder="CPF * (000.000.000-00)"
            size="lg"
            class="w-full"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-identification"
                size="20"
                class="text-gray-400"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField :error="errors.tutorEmail">
          <UInput
            v-model="tutorEmail"
            type="email"
            placeholder="E-mail *"
            size="lg"
            icon="i-heroicons-envelope"
            class="w-full"
          />
        </UFormField>

        <UInput
          v-model="tutorAddress"
          type="text"
          placeholder="Endereço (opcional)"
          size="lg"
          icon="i-heroicons-map-pin"
        />

        <UFormField :error="errors.tutorPassword">
          <UInput
            v-model="tutorPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Senha *"
            size="lg"
            icon="i-heroicons-lock-closed"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="
                  showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                "
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField :error="errors.tutorConfirmPassword">
          <UInput
            v-model="tutorConfirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirmar senha *"
            size="lg"
            icon="i-heroicons-lock-closed"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="
                  showConfirmPassword
                    ? 'i-heroicons-eye-slash'
                    : 'i-heroicons-eye'
                "
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          label="Próximo"
          size="lg"
          class="w-full justify-center bg-accent text-white mt-2"
          trailing-icon="i-heroicons-arrow-right"
          @click="goToStep2"
        />
      </div>

      <!-- Step 2: Pet -->
      <div v-if="currentStep === 2" class="flex flex-col gap-4">
        <UFormField :error="errors.petName">
          <UInput
            v-model="petName"
            type="text"
            placeholder="Nome do pet *"
            size="lg"
            icon="i-heroicons-heart"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.petSpecies">
          <USelect
            v-model="petSpecies"
            :items="speciesOptions"
            placeholder="Espécie *"
            size="lg"
            icon="i-heroicons-sparkles"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.petBreed">
          <UInput
            v-model="petBreed"
            type="text"
            placeholder="Raça *"
            size="lg"
            icon="i-heroicons-tag"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.petSize">
          <USelect
            v-model="petSize"
            :items="sizeOptions"
            placeholder="Porte *"
            size="lg"
            icon="i-heroicons-arrows-pointing-out"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.petCoat">
          <UInput
            v-model="petCoat"
            type="text"
            placeholder="Pelagem * (ex: curta, longa, dupla)"
            size="lg"
            icon="i-heroicons-swatch"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.petBirthDate" label="Data de nascimento *">
          <UInput
            v-model="petBirthDate"
            type="date"
            size="lg"
            icon="i-heroicons-calendar"
            class="w-full"
          />
          <template #hint>
            <span v-if="petAge" class="text-xs text-gray-400"
              >Idade: {{ petAge }}</span
            >
          </template>
        </UFormField>

        <UFormField :error="errors.petMicrochipped">
          <USelect
            v-model="petMicrochipped"
            :items="booleanOptions"
            placeholder="Microchipado(a) *"
            size="lg"
            icon="i-heroicons-cpu-chip"
            class="w-full"
          />
        </UFormField>

        <UFormField :error="errors.petNeutered">
          <USelect
            v-model="petNeutered"
            :items="booleanOptions"
            placeholder="Castrado(a) *"
            size="lg"
            icon="i-heroicons-scissors"
            class="w-full"
          />
        </UFormField>

        <UTextarea
          v-model="petBehavior"
          placeholder="Comportamento (ex: dócil, agitado, medroso)"
          size="lg"
          :rows="3"
        />

        <UTextarea
          v-model="petConditions"
          placeholder="Doenças prévias"
          size="lg"
          :rows="3"
        />

        <UAlert
          v-if="apiError"
          color="error"
          variant="soft"
          :description="apiError"
          icon="i-heroicons-exclamation-circle"
        />

        <div class="flex gap-3 mt-2">
          <UButton
            label="Voltar"
            size="lg"
            variant="outline"
            class="flex-1 justify-center"
            leading-icon="i-heroicons-arrow-left"
            :disabled="loading"
            @click="currentStep = 1"
          />
          <UButton
            label="Criar conta"
            size="lg"
            class="flex-1 justify-center bg-accent text-white"
            :loading="loading"
            @click="submit"
          />
        </div>
      </div>

      <p class="text-center text-sm text-gray-500 -mt-2">
        Já tem uma conta?
        <NuxtLink to="/login" class="text-accent font-medium hover:underline">
          Entrar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
