<script setup lang="ts">
definePageMeta({
  noPadding: true,
});

const { isLoggedIn } = useAuth();
const { api } = useApi();
const toast = useToast();

const WHATSAPP_URL =
  "https://wa.me/5511978654921?text=" +
  encodeURIComponent(
    "Oi, gostaria de solicitar uma consulta com a ConectaVet."
  );

function openWhatsApp() {
  window.open(WHATSAPP_URL, "_blank", "noopener");
}

const pets = ref<{ id: string; name: string }[]>([]);

const form = reactive({
  pet_id: "",
  date: "",
  time: "",
  notes: ""
});

const pending = ref(false);

onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      pets.value = await api<{ id: string; name: string }[]>('/pets/my');
    } catch (e) {
      console.error(e);
    }
  }
});

async function submitRequest() {
  if (!isLoggedIn.value) return;
  pending.value = true;
  try {
    await api('/consultations', {
      method: 'POST',
      body: {
        pet_id: form.pet_id || null,
        date: form.date,
        time: form.time,
        notes: form.notes
      }
    });
    toast.add({ title: 'Consulta agendada!', description: 'Sua solicitação foi enviada.', color: 'success' });
    form.pet_id = '';
    form.date = '';
    form.time = '';
    form.notes = '';
  } catch (e: any) {
    toast.add({ title: 'Erro', description: e?.data?.error || 'Não foi possível agendar.', color: 'error' });
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center px-4 py-6 lg:py-10 max-w-4xl mx-auto">
    <h1 class="text-2xl lg:text-4xl font-semibold text-primary text-center mb-6">
      Solicitar consulta
    </h1>

    <div v-if="!isLoggedIn" class="w-full flex flex-col items-center">
      <p class="text-primary/70 text-center max-w-2xl mb-6 text-sm lg:text-base">
        Faça login para agendar uma consulta diretamente pelo sistema ou clique na imagem abaixo para falar com a nossa equipe pelo WhatsApp.
      </p>

      <button
        type="button"
        class="cursor-pointer group w-full max-w-xl rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 hover:scale-[1.01] transition-transform"
        @click="openWhatsApp"
      >
        <img
          src="/images/img-consulta.png"
          alt="Solicitar consulta ConectaVet"
          class="w-full h-auto object-contain"
        />
      </button>

      <div class="flex gap-4 mt-6">
        <UButton to="/login" color="primary" variant="solid" size="lg">Fazer Login</UButton>
        <UButton :to="WHATSAPP_URL" target="_blank" color="success" variant="solid" size="lg" icon="i-mdi-whatsapp">WhatsApp</UButton>
      </div>
    </div>

    <div v-else class="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Nova Consulta</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Preencha os dados abaixo para agendar</p>
        </template>
        <form @submit.prevent="submitRequest" class="flex flex-col gap-4">
          <UFormField label="Pet (Opcional)">
            <USelect v-model="form.pet_id" :options="pets" option-attribute="name" value-attribute="id" placeholder="Para qual pet?" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Data">
              <UInput v-model="form.date" type="date" required />
            </UFormField>
            
            <UFormField label="Horário">
              <UInput v-model="form.time" type="time" required />
            </UFormField>
          </div>

          <UFormField label="Observações (Opcional)">
            <UTextarea v-model="form.notes" placeholder="Descreva brevemente o motivo da consulta..." />
          </UFormField>

          <div class="pt-2">
            <UButton type="submit" color="primary" class="w-full justify-center" :loading="pending">
              Confirmar Agendamento
            </UButton>
          </div>
        </form>
      </UCard>

      <div class="flex flex-col items-center justify-center space-y-6 pt-4">
        <div class="text-center">
          <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">Precisa de ajuda urgente?</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Nossa equipe está pronta para te atender rapidamente no WhatsApp.</p>
        </div>
        <UButton :to="WHATSAPP_URL" target="_blank" color="success" size="xl" icon="i-mdi-whatsapp" class="font-bold">
          Chamar no WhatsApp
        </UButton>
      </div>
    </div>
  </div>
</template>
