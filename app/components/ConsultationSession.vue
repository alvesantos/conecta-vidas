<script setup lang="ts">
const {
  active,
  isOpen,
  saving,
  generatingLink,
  finalizing,
  minimize,
  resume,
  generateLink,
  saveNotes,
  finalize,
} = useActiveConsultation();
</script>

<template>
  <!-- Pílula flutuante: consulta remotada (minimizada) -->
  <Teleport to="body">
    <div
      v-if="active && !isOpen"
      class="fixed bottom-4 right-4 z-90 flex items-center gap-3 rounded-full bg-primary text-white shadow-2xl pl-4 pr-2 py-2 cursor-pointer hover:brightness-110 transition"
      @click="resume"
    >
      <span class="relative flex size-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full size-3 bg-white"></span>
      </span>
      <div class="leading-tight">
        <p class="text-sm font-semibold">Consulta em andamento</p>
        <p class="text-xs opacity-90">
          {{ active.tutor_name
          }}<span v-if="active.pet_name"> • {{ active.pet_name }}</span>
        </p>
      </div>
      <UButton
        color="neutral"
        variant="solid"
        size="xs"
        icon="i-heroicons-arrows-pointing-out"
        class="rounded-full"
        @click.stop="resume"
      />
    </div>
  </Teleport>

  <!-- Modal da sala de consulta -->
  <Teleport to="body">
    <div
      v-if="active && isOpen"
      class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        @click="minimize"
      ></div>

      <UCard
        class="relative w-full max-w-3xl shadow-2xl z-10 flex flex-col max-h-full"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-lg font-semibold text-gray-800 flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-video-camera"
                class="text-primary size-6"
              />
              Sala de Consulta
            </h3>
            <div class="flex items-center gap-1">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-minus"
                title="Remotar (minimizar)"
                @click="minimize"
              />
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
          <!-- Info do Paciente e Tutor -->
          <div
            class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100"
          >
            <div>
              <p
                class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
              >
                Tutor (Responsável)
              </p>
              <p class="text-base font-medium text-gray-800">
                {{ active.tutor_name }}
              </p>
            </div>
            <div>
              <p
                class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
              >
                Paciente (Pet)
              </p>
              <p class="text-base font-medium text-gray-800">
                {{ active.pet_name || "—" }}
              </p>
            </div>
          </div>

          <!-- Sala protegida pelo acesso do portal -->
          <div
            v-if="!active.meet_link"
            class="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="min-w-0">
              <p class="font-semibold text-primary">
                Videoconferência
              </p>
              <p class="text-sm text-gray-600">
                Prepare uma sala exclusiva e aleatória para este atendimento.
              </p>
            </div>
            <UButton
              color="primary"
              label="Preparar sala"
              icon="i-heroicons-video-camera"
              :loading="generatingLink"
              @click="generateLink"
            />
          </div>
          <ConsultationVideoRoom v-else :consultation-id="active.id" />

          <!-- Bloco de Notas / Prontuário Ao Vivo -->
          <div class="flex flex-col gap-2 h-64">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-gray-700"
                >Anotações (Evolução / Prontuário)</label
              >
              <UButton
                size="xs"
                variant="soft"
                color="neutral"
                icon="i-heroicons-bookmark"
                label="Salvar rascunho"
                :loading="saving"
                @click="saveNotes"
              />
            </div>
            <UTextarea
              v-model="active.notes"
              placeholder="Digite livremente durante a consulta..."
              class="w-full flex-1"
              textarea-class="h-full resize-none"
            />
            <label class="flex items-center gap-2 text-sm text-gray-600">
              <UCheckbox v-model="active.notes_visible_to_patient" />
              Compartilhar esta evolução com o paciente ou tutor
            </label>
            <p class="text-xs text-gray-500 mt-1">
              As anotações sempre integram o prontuário clínico, mas só aparecem
              no portal quando o compartilhamento estiver marcado.
            </p>
          </div>
        </div>

        <template #footer>
          <div
            class="flex justify-between items-center border-t border-gray-100 pt-4"
          >
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-minus"
              @click="minimize"
              >Remotar</UButton
            >
            <UButton
              color="success"
              icon="i-heroicons-check-badge"
              label="Finalizar Consulta"
              :disabled="active.status === 'realizada'"
              :loading="finalizing"
              @click="
                () => {
                  void finalize();
                }
              "
            />
          </div>
        </template>
      </UCard>
    </div>
  </Teleport>
</template>
