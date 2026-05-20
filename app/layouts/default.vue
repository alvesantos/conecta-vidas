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
      <footer class="text-white bg-accent px-6 py-8 flex flex-col items-center gap-2 text-sm text-center">
        <img src="/conecta-icon.png" alt="ConectaVet" class="h-10 w-auto mb-1 opacity-90" />
        <span class="font-semibold tracking-wide">ConectaVet</span>
        <span class="text-white/70">Telemedicina veterinária com cuidado e segurança</span>
        <span class="text-white/50 text-xs mt-1">© {{ new Date().getFullYear() }} ConectaVet — Todos os direitos reservados</span>
      </footer>
    </div>
  </div>
</template>
