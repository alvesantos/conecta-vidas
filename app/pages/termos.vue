<template>
  <div class="max-w-4xl mx-auto">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-body-strong">Termos e Políticas</h1>
      <p class="text-body-muted text-sm mt-1">
        Leia atentamente o contrato antes de confirmar sua concordância.
      </p>
    </div>

    <!-- Visualizador de PDF -->
    <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div class="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex items-center gap-2 text-gray-600 text-sm font-medium min-w-0">
          <UIcon name="i-heroicons-document-text" class="size-5 text-primary shrink-0" />
          <span class="truncate">Termo e Contrato — Clientes ConectaVet</span>
        </div>
        <a
          :href="pdfUrl"
          target="_blank"
          class="self-start sm:self-auto flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium whitespace-nowrap"
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="size-4" />
          Abrir em nova aba
        </a>
      </div>

      <!-- Mobile: card "abrir/baixar PDF" (iframes de PDF não funcionam bem em mobile) -->
      <div class="sm:hidden flex flex-col items-center gap-3 p-6 text-center">
        <UIcon name="i-heroicons-document-text" class="size-14 text-gray-300" />
        <p class="text-gray-600 text-sm">
          Toque no botão abaixo para visualizar o contrato em PDF.
        </p>
        <a
          :href="pdfUrl"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="size-4" />
          Abrir PDF
        </a>
        <a
          :href="pdfUrl"
          download
          class="text-primary text-xs hover:underline"
        >
          Ou baixar uma cópia
        </a>
      </div>

      <!-- Desktop: iframe embutido -->
      <div class="relative hidden sm:block h-125 lg:h-150">
        <iframe
          :src="pdfUrl"
          class="w-full h-full border-0"
          type="application/pdf"
          title="Termos e Políticas ConectaVet"
        />
      </div>
    </div>

    <!-- Área de confirmação -->
    <div
      class="mt-6 rounded-2xl border p-4 sm:p-5 transition-colors"
      :class="agreed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'"
    >
      <label class="flex items-start gap-3 cursor-pointer select-none group">
        <div class="mt-0.5 shrink-0">
          <input
            v-model="agreed"
            type="checkbox"
            class="sr-only"
          />
          <div
            class="size-5 rounded border-2 flex items-center justify-center transition-all"
            :class="agreed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 bg-white group-hover:border-primary'"
          >
            <UIcon
              v-if="agreed"
              name="i-heroicons-check"
              class="size-3.5 text-white"
            />
          </div>
        </div>
        <span class="text-gray-700 text-sm leading-relaxed">
          Li e estou de acordo com os
          <strong class="text-primary">Termos e Políticas</strong>
          da ConectaVet, incluindo as condições de uso do serviço de telemedicina veterinária.
        </span>
      </label>

      <!-- Botão de confirmação -->
      <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <UButton
          :disabled="!agreed"
          :loading="confirming"
          :color="confirmed ? 'success' : 'primary'"
          size="lg"
          class="transition-all justify-center"
          block
          @click="handleConfirm"
        >
          <template #leading>
            <UIcon
              :name="confirmed ? 'i-heroicons-check-badge' : 'i-heroicons-shield-check'"
              class="size-5"
            />
          </template>
          {{ confirmed ? 'Confirmado! ✓' : 'Confirmar concordância' }}
        </UButton>

        <span
          v-if="confirmed"
          class="text-green-600 text-sm font-medium flex items-center gap-1.5"
        >
          <UIcon name="i-heroicons-check-circle" class="size-4" />
          Concordância registrada
        </span>
      </div>

      <!-- Mensagem de aviso se não aceitou -->
      <p
        v-if="!agreed && showWarning"
        class="mt-3 text-amber-600 text-xs flex items-center gap-1.5"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="size-4 shrink-0" />
        Marque a caixa acima para confirmar que leu e concordou com os termos.
      </p>
    </div>

    <!-- Informação de download (apenas desktop, no mobile já está dentro do card) -->
    <div class="mt-4 hidden sm:flex items-center justify-center gap-2 text-gray-400 text-xs pb-4">
      <UIcon name="i-heroicons-information-circle" class="size-4 shrink-0" />
      <span>
        Você também pode
        <a :href="pdfUrl" download class="text-primary hover:underline">baixar uma cópia do documento</a>
        para seus registros.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const pdfUrl = '/Termo e Contrato Clientes Conectavet.pdf'

const agreed = ref(false)
const confirmed = ref(false)
const confirming = ref(false)
const showWarning = ref(false)

// Recupera confirmação anterior salva no localStorage
onMounted(() => {
  const saved = localStorage.getItem('conectavet_terms_confirmed')
  if (saved === 'true') {
    agreed.value = true
    confirmed.value = true
  }
})

async function handleConfirm() {
  if (!agreed.value) {
    showWarning.value = true
    return
  }

  confirming.value = true

  // Simula pequeno delay para feedback visual
  await new Promise(resolve => setTimeout(resolve, 600))

  confirmed.value = true
  confirming.value = false
  localStorage.setItem('conectavet_terms_confirmed', 'true')
}

// Esconde aviso quando o usuário marca o checkbox
watch(agreed, (val) => {
  if (val) showWarning.value = false
})
</script>
