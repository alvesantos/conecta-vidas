<script setup lang="ts">
definePageMeta({ layout: 'backoffice', middleware: 'admin' });

const { api } = useApi();

interface AdminUserRow {
  id: string;
  type: 'tutor' | 'admin';
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

const users = ref<AdminUserRow[]>([]);
const pets = ref<PetRow[]>([]);
const plans = ref<PlanRow[]>([]);
const birthdayPets = ref<BirthdayPet[]>([]);
const pending = ref(true);

onMounted(async () => {
  try {
    const [u, p, pl, bp] = await Promise.all([
      api<AdminUserRow[]>('/admin/users'),
      api<PetRow[]>('/admin/pets'),
      api<PlanRow[]>('/admin/plans'),
      api<BirthdayPet[]>('/admin/pets/birthdays'),
    ]);
    users.value = u;
    pets.value = p;
    plans.value = pl;
    birthdayPets.value = bp;
  } finally {
    pending.value = false;
  }
});

const totalUsers = computed(() => users.value.length);
const totalAdmins = computed(() => users.value.filter((u) => u.type === 'admin').length);
const totalTutors = computed(() => users.value.filter((u) => u.type === 'tutor').length);
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

const birthdayColumns = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'breed', header: 'Raça' },
  { id: 'age', accessorFn: (row: BirthdayPet) => calcAge(row.birth_date), header: 'Idade' },
  { accessorKey: 'owner_name', header: 'Responsável' },
  { accessorKey: 'owner_email', header: 'E-mail do Responsável' },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Backoffice</h1>
    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Visão geral do sistema</p>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        to="/backoffice/usuarios"
        class="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow p-6 flex items-center gap-4"
      >
        <UIcon name="i-heroicons-users" class="size-8 text-accent" />
        <div>
          <p class="font-semibold text-gray-800 dark:text-gray-100">Gerenciar usuários</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Lista, edição, planos e exclusão</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/backoffice/pets"
        class="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow p-6 flex items-center gap-4"
      >
        <UIcon name="i-mdi-paw" class="size-8 text-accent" />
        <div>
          <p class="font-semibold text-gray-800 dark:text-gray-100">Gerenciar animais</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Visualizar animais cadastrados e responsáveis</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/backoffice/planos"
        class="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow p-6 flex items-center gap-4"
      >
        <UIcon name="i-heroicons-credit-card" class="size-8 text-accent" />
        <div>
          <p class="font-semibold text-gray-800 dark:text-gray-100">Gerenciar planos</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Criar e editar planos disponíveis</p>
        </div>
      </NuxtLink>
    </div>

    <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse h-28" />
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Usuários</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalUsers }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Responsáveis</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalTutors }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Administradores</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ totalAdmins }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Com plano</p>
        <p class="text-3xl font-bold text-accent mt-2">{{ totalSubscribed }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Animais cadastrados</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ pets.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Planos</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ plans.length }}</p>
      </div>
    </div>

    <div v-if="!pending" class="mt-8 grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6 bg-white dark:bg-gray-800 rounded-xl shadow">
        <div class="flex items-center gap-2 p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <UIcon name="i-heroicons-cake" class="size-5 text-amber-500" />
          <h2 class="font-semibold text-gray-800 dark:text-gray-100 capitalize">Aniversariantes de {{ currentMonthName }}</h2>
          <UBadge :label="String(birthdayPets.length)" color="amber" variant="subtle" class="ml-auto" />
        </div>

        <UTable
          :data="birthdayPets"
          :columns="birthdayColumns"
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
              <div v-else class="size-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <UIcon name="i-mdi-paw" class="size-4 text-amber-500" />
              </div>
              <span class="font-medium text-gray-800 dark:text-gray-100">{{ row.original.name }}</span>
            </div>
          </template>

          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <UIcon name="i-heroicons-cake" class="size-10 mb-2" />
              <p class="text-sm">Nenhum aniversariante em {{ currentMonthName }}</p>
            </div>
          </template>
        </UTable>
      </div>
    </div>

  </div>
</template>
