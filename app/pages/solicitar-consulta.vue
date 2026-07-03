<template>
  <div class="flex flex-col items-center px-4 py-6 lg:py-10 max-w-4xl mx-auto w-full">
    <h1 class="text-2xl lg:text-4xl font-semibold text-body-strong text-center mb-6">
      Solicitar consulta
    </h1>

    <div v-if="!isLoggedIn" class="w-full flex flex-col items-center">
      <p class="text-body-muted text-center max-w-2xl mb-6 text-sm lg:text-base">
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

    <div v-else class="w-full flex flex-col items-center">
      <div class="flex items-center gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
        <button
          class="px-6 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'agendar' ? 'bg-white dark:bg-gray-700 text-primary shadow' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
          @click="activeTab = 'agendar'"
        >
          Agendar Agora
        </button>
        <button
          class="px-6 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'whatsapp' ? 'bg-white dark:bg-gray-700 text-success shadow' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
          @click="activeTab = 'whatsapp'"
        >
          Falar no WhatsApp
        </button>
      </div>

      <div v-if="activeTab === 'agendar'" class="w-full">
        <UCard class="w-full">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Nova Consulta</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Preencha os dados abaixo para agendar</p>
          </template>
          <form @submit.prevent="submitRequest" class="flex flex-col gap-6">
            <UFormField label="Pet (Opcional)">
              <USelect v-model="form.pet_id" :items="pets" placeholder="Para qual pet?" size="lg" class="w-full" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Data">
                <UInput v-model="form.date" type="date" required size="lg" class="w-full" />
              </UFormField>
              
              <UFormField label="Horário">
                <UInput v-model="form.time" type="time" required size="lg" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="Observações">
              <!-- Para não redimensionar, o NuxtUI UTextarea aceita textarea-class ou classes diretas -->
              <UTextarea v-model="form.notes" placeholder="Descreva os motivos da consulta..." :rows="6" textarea-class="resize-none" class="resize-none w-full" size="lg" />
            </UFormField>

            <div class="pt-2">
              <UButton type="submit" color="primary" class="w-full justify-center" size="lg" :loading="pending">
                Confirmar Agendamento
              </UButton>
            </div>
          </form>
        </UCard>
      </div>

      <div v-if="activeTab === 'whatsapp'" class="w-full flex flex-col items-center">
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
        <div class="mt-6">
          <UButton :to="WHATSAPP_URL" target="_blank" color="success" size="xl" icon="i-mdi-whatsapp" class="font-bold">
            Chamar no WhatsApp
          </UButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ noPadding: true });

const { isLoggedIn } = useAuth();
const { api } = useApi();
const toast = useToast();

const WHATSAPP_URL = "https://wa.me/5511978654921?text=" + encodeURIComponent("Oi, gostaria de solicitar uma consulta com a ConectaVet.");

function openWhatsApp() {
  window.open(WHATSAPP_URL, "_blank", "noopener");
}

const activeTab = ref<'agendar' | 'whatsapp'>('agendar');
const pets = ref<{ value: string; label: string }[]>([]);

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
      const response = await api<any[]>('/pets/my');
      console.log('Pets loaded:', response);
      pets.value = (response || []).map(p => ({ label: p.name, value: p.id }));
    } catch (e) {
      console.error('Error loading pets:', e);
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
