<script setup>
const route = useRoute()
</script>

<template>
  <div class="flex min-h-screen md:flex-row flex-col">
    <!-- Sidebar (desktop) -->
    <AppSidebar class="hidden md:flex shrink-0" />

    <!-- Coluna direita: topbar + conteúdo + footer -->
    <div class="flex flex-col flex-1 min-w-0">
      <!-- Topbar (mobile) -->
      <AppTopbar />

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

          <div class="md:w-1/3 hidden md:block" />

          <!-- Centro: slogan + copyright -->
          <div class="flex flex-col items-center gap-2 md:w-1/3 text-center">
            <span class="text-white text-sm leading-relaxed">Telemedicina veterinária com cuidado e segurança</span>
            <span class="text-white/70 text-xs">© {{ new Date().getFullYear() }} ConectaVet — Todos os direitos reservados</span>
          </div>

          <!-- Direita: contato -->
          <div class="flex flex-col items-center md:items-end gap-3 md:w-1/3">
            <a
              href="https://wa.me/5511978786184"
              target="_blank"
              class="flex items-center gap-2 text-white hover:text-green-300 transition-colors"
            >
              <UIcon name="i-mdi-whatsapp" class="size-5 text-green-400 shrink-0" />
              <span class="text-sm">(11) 97878-6184</span>
            </a>
            <a
              href="mailto:suporteconectavet@gmail.com"
              class="flex items-center gap-2 text-white hover:text-white/70 transition-colors"
            >
              <UIcon name="i-heroicons-envelope" class="size-5 shrink-0" />
              <span class="text-sm">suporteconectavet@gmail.com</span>
            </a>
          </div>

        </div>
      </footer>
    </div>
  </div>
</template>
