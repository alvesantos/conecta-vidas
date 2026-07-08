<script lang="ts" setup>
  const handleBannerClick = () => {
    const msg = encodeURIComponent('Olá! Vim pelo site da ConectaVet e gostaria de saber mais sobre os planos.');
    window.open(`https://wa.me/5511978654921?text=${msg}`, '_blank');
  }
</script>

<template>
  <div>
    <!-- WHATSAPP BANNER -->
    <section>
      <UCard @click="handleBannerClick" :ui="{ body: 'bg-primary relative' }">
        <img
          src="/dog_banner.png"
          alt="Dog Banner Background"
          class="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.85] lg:object-[center_58%]"
        />

        <div class="lg:min-h-50 min-h-42 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-4 z-10 relative">
          <!-- middle -->
          <div class="text-foreground lg:text-2xl text-start pb-4">
            <h4 class="pt-2">Fale agora com um profissional e tire suas dúvidas!</h4>
            <p class="lg:text-lg text-sm text-foreground/60">Orientação profissional na palma da sua mão.</p>
          </div>

          <!-- right -->
          <div class="text-foreground w-full flex justify-center">
            <UButton
              size="xl"
              class="bg-[#18c256] hover:bg-[#139645] text-white flex items-center gap-2 rounded-lg px-6 py-4 cursor-pointer"
            >
              <!-- WhatsApp icon -->
              <UIcon name="ph-whatsapp-logo" class="size-8" />
              <!-- Button text -->
              <span>Falar no WhatsApp</span>
            </UButton>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
<style scoped>
</style>