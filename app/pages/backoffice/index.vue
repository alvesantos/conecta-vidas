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

const users = ref<AdminUserRow[]>([]);
const pets = ref<PetRow[]>([]);
const plans = ref<PlanRow[]>([]);
const pending = ref(true);

onMounted(async () => {
  try {
    const [u, p, pl] = await Promise.all([
      api<AdminUserRow[]>('/admin/users'),
      api<PetRow[]>('/admin/pets'),
      api<PlanRow[]>('/admin/plans'),
    ]);
    users.value = u;
    pets.value = p;
    plans.value = pl;
  } finally {
    pending.value = false;
  }
});

const totalUsers = computed(() => users.value.length);
const totalAdmins = computed(() => users.value.filter((u) => u.type === 'admin').length);
const totalTutors = computed(() => users.value.filter((u) => u.type === 'tutor').length);
const totalSubscribed = computed(() => users.value.filter((u) => !!u.plan_title).length);
</script>

<template>
  <div class="max-w-6xl">
    <h1 class="text-2xl font-bold text-gray-800">Backoffice</h1>
    <p class="text-gray-500 text-sm mt-1">Visão geral do sistema</p>

    <div v-if="pending" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow p-6 animate-pulse h-28" />
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
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
        <p class="text-sm text-gray-500">Com plano</p>
        <p class="text-3xl font-bold text-accent mt-2">{{ totalSubscribed }}</p>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Animais cadastrados</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ pets.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-sm text-gray-500">Planos</p>
        <p class="text-3xl font-bold text-primary mt-2">{{ plans.length }}</p>
      </div>
    </div>

    <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        to="/backoffice/usuarios"
        class="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 flex items-center gap-4"
      >
        <UIcon name="i-heroicons-users" class="size-8 text-accent" />
        <div>
          <p class="font-semibold text-gray-800">Gerenciar usuários</p>
          <p class="text-sm text-gray-500">Lista, edição, planos e exclusão</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/backoffice/pets"
        class="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 flex items-center gap-4"
      >
        <UIcon name="i-mdi-paw" class="size-8 text-accent" />
        <div>
          <p class="font-semibold text-gray-800">Gerenciar animais</p>
          <p class="text-sm text-gray-500">Visualizar animais cadastrados e responsáveis</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/backoffice/planos"
        class="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 flex items-center gap-4"
      >
        <UIcon name="i-heroicons-credit-card" class="size-8 text-accent" />
        <div>
          <p class="font-semibold text-gray-800">Gerenciar planos</p>
          <p class="text-sm text-gray-500">Criar e editar planos disponíveis</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
