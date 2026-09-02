<script setup lang="ts">
definePageMeta({ layout: 'painel', middleware: 'painel', portal: 'adm' });

const { api } = useApi();

interface AdminUserRow {
  id: string;
  type: 'tutor' | 'admin' | 'medico' | 'veterinario';
  plan_title?: string | null;
}

interface PetRow { id: string }
interface PlanRow { id: string }

interface BirthdayPet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  avatar_url?: string | null;
  owner_name?: string | null;
  owner_email?: string | null;
}

interface BirthdayHuman {
  id: string;
  name: string;
  contact?: string | null;
  relationship: string;
  birth_date: string;
  type: string;
}

const users = ref<AdminUserRow[]>([]);
const pets = ref<PetRow[]>([]);
const plans = ref<PlanRow[]>([]);
const birthdayPets = ref<BirthdayPet[]>([]);
const birthdayHumans = ref<BirthdayHuman[]>([]);
const pending = ref(true);

onMounted(async () => {
  try {
    const [u, p, pl, bp, bh] = await Promise.all([
      api<AdminUserRow[]>('/admin/users'),
      api<PetRow[]>('/admin/pets'),
      api<PlanRow[]>('/admin/plans'),
      api<BirthdayPet[]>('/admin/pets/birthdays'),
      api<BirthdayHuman[]>('/admin/users/birthdays'),
    ]);
    users.value = u;
    pets.value = p;
    plans.value = pl;
    birthdayPets.value = bp;
    birthdayHumans.value = bh;
  } finally {
    pending.value = false;
  }
});

const totalUsers = computed(() => users.value.length);
const totalAdmins = computed(() => users.value.filter((u) => u.type === 'admin').length);
const totalTutors = computed(() => users.value.filter((u) => u.type === 'tutor').length);
const totalDoctors = computed(() => users.value.filter((u) => u.type === 'medico').length);
const totalVets = computed(() => users.value.filter((u) => u.type === 'veterinario').length);
const totalSubscribed = computed(() => users.value.filter((u) => !!u.plan_title).length);

function calcAge(dateStr: string) {
  const birth = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age === 1 ? '1 ano' : `${age} anos`;
}

const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });

const petBirthdayColumns = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'breed', header: 'Raça' },
  { id: 'age', accessorFn: (row: BirthdayPet) => calcAge(row.birth_date), header: 'Idade' },
  { accessorKey: 'owner_name', header: 'Responsável' },
  { accessorKey: 'owner_email', header: 'E-mail do Responsável' },
];

const humanBirthdayColumns = [
  { accessorKey: 'name', header: 'Nome' },
  { id: 'age', accessorFn: (row: BirthdayHuman) => calcAge(row.birth_date), header: 'Idade' },
  { accessorKey: 'relationship', header: 'Vínculo' },
  { accessorKey: 'contact', header: 'Contato (E-mail/Tel)' },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
    <p class="text-gray-500 text-sm mt-1">Visão geral do sistema</p>

    <div v-if="pending" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow p-6 animate-pulse h-28" />
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Usuários</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalUsers }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Responsáveis</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalTutors }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Administradores</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalAdmins }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Médicos</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ totalDoctors }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Veterinários</p>
        <p class="text-3xl font-bold text-accent mt-2">{{ totalVets }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Com plano</p>
        <p class="text-3xl font-bold text-accent mt-2">{{ totalSubscribed }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Pets cadastrados</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ pets.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Planos</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ plans.length }}</p>
      </div>
    </div>

    <div v-if="!pending" class="mt-8 grid grid-cols-12 gap-4">
      <!-- Tabela Pets -->
      <div class="col-span-12 xl:col-span-6 bg-white rounded-xl shadow">
        <div class="flex items-center gap-2 p-6 pb-4 border-b border-gray-100">
          <UIcon name="i-heroicons-cake" class="size-5 text-amber-500" />
          <h2 class="font-semibold text-gray-800 capitalize">Pets Aniversariantes de {{ currentMonthName }}</h2>
          <UBadge :label="String(birthdayPets.length)" color="amber" variant="subtle" class="ml-auto" />
        </div>

        <UTable
          :data="birthdayPets"
          :columns="petBirthdayColumns"
          class="w-full"
        >
          <template #name-cell="{ row }">
            <div class="flex items-center gap-3">
              <img
                v-if="row.original.avatar_url"
                :src="row.original.avatar_url"
                :alt="row.original.name"
                class="size-8 rounded-full object-cover shrink-0"
              />
              <div v-else class="size-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <UIcon name="i-mdi-paw" class="size-4 text-amber-500" />
              </div>
              <span class="font-medium text-gray-800">{{ row.original.name }}</span>
            </div>
          </template>

          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
              <UIcon name="i-heroicons-cake" class="size-10 mb-2" />
              <p class="text-sm">Nenhum pet aniversariante em {{ currentMonthName }}</p>
            </div>
          </template>
        </UTable>
      </div>

      <!-- Tabela Humanos -->
      <div class="col-span-12 xl:col-span-6 bg-white rounded-xl shadow">
        <div class="flex items-center gap-2 p-6 pb-4 border-b border-gray-100">
          <UIcon name="i-heroicons-gift" class="size-5 text-indigo-500" />
          <h2 class="font-semibold text-gray-800 capitalize">Humanos Aniversariantes de {{ currentMonthName }}</h2>
          <UBadge :label="String(birthdayHumans.length)" color="indigo" variant="subtle" class="ml-auto" />
        </div>

        <UTable
          :data="birthdayHumans"
          :columns="humanBirthdayColumns"
          class="w-full"
        >
          <template #name-cell="{ row }">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-user" class="size-4 text-indigo-500" />
              </div>
              <span class="font-medium text-gray-800">{{ row.original.name }}</span>
            </div>
          </template>

          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
              <UIcon name="i-heroicons-gift" class="size-10 mb-2" />
              <p class="text-sm">Nenhum humano aniversariante em {{ currentMonthName }}</p>
            </div>
          </template>
        </UTable>
      </div>
    </div>

  </div>
</template>
