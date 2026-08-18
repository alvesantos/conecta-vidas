<script setup>
const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-foreground">
    <!-- Header superior (estilo Apple) -->
    <AppHeader />

    <!-- Coluna de conteúdo + footer -->
    <div class="flex flex-col flex-1 min-w-0">
      <!-- Conteúdo da página -->
      <main
        class="flex-1"
        :class="route.meta.noPadding ? '' : 'p-6 md:p-10'"
      >
        <slot />
      </main>

      <!-- Footer sempre na base da coluna de conteúdo -->
      <footer class="text-white bg-primary mt-10 border-t border-white/10 px-6 md:px-10 py-8">
        <!-- Desktop: 3 colunas | Mobile: empilhado centralizado -->
        <div class="flex flex-col md:flex-row md:items-center gap-8 md:gap-4">

          <!-- Esquerda: links legais -->
          <div class="flex flex-col items-center md:items-start gap-2 md:w-1/3">
            <NuxtLink
              to="/termos"
              class="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <UIcon name="i-heroicons-document-text" class="size-5 shrink-0" />
              <span class="text-sm">Termos, Política e LGPD</span>
            </NuxtLink>
          </div>

          <!-- Centro: slogan + copyright -->
          <div class="flex flex-col items-center gap-2 md:w-1/3 text-center">
            <span class="text-white text-sm leading-relaxed">Telemedicina veterinária com cuidado e segurança</span>
            <span class="text-white/70 text-xs">© {{ new Date().getFullYear() }} ConectaVidas. Todos os direitos reservados</span>
            <a
              href="https://rogabsolutions.com"
              target="_blank"
              class="text-white/40 hover:text-white/70 text-xs transition-colors"
            >Desenvolvido por Rogab Solutions</a>
          </div>

          <!-- Direita: contato -->
          <div class="flex flex-col items-center md:items-end gap-3 md:w-1/3">
            <a
              href="https://wa.me/5511978654921"
              target="_blank"
              class="flex items-center gap-2 text-white hover:text-green-300 transition-colors"
            >
              <UIcon name="i-mdi-whatsapp" class="size-5 text-green-400 shrink-0" />
              <span class="text-sm">(11) 97865-4921</span>
            </a>
            <a
              href="mailto:suporteconectavidas@gmail.com"
              class="flex items-center gap-2 text-white hover:text-white/70 transition-colors"
            >
              <UIcon name="i-heroicons-envelope" class="size-5 shrink-0" />
              <span class="text-sm">suporteconectavidas@gmail.com</span>
            </a>
          </div>

        </div>
      </footer>
    </div>
  </div>
</template>
