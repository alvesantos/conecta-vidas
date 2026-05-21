<script lang="ts" setup>
const advantageIcons = [
  {
    icon: '/eneli_studio_icons/eneli_studio_clock.png',
    label: 'Atendimento rápido'
  },
  {
    icon: '/eneli_studio_icons/eneli_studio_house.png',
    label: 'Sem sair de casa'
  },
  {
    icon: '/eneli_studio_icons/eneli_studio_check_shield.png',
    label: 'Orientação segura'
  },
  {
    icon: '/eneli_studio_icons/eneli_studio_heart.png',
    label: 'Mais cuidado, menos preocupação'
  }
]

const AdvantageItem = (props: { icon: string, label: string }) =>
  h('div', {
    class: 'bg-foreground p-4 text-center text-accent'
  }, [
    h('img', {
      src: props.icon,
      class: 'mx-auto mb-4 w-16 h-16 object-contain'
    }),

    h('p', {}, props.label)
  ])

  const handleBannerClick = () => {
    const msg = encodeURIComponent('Olá! Vim pelo site da ConectaVet e gostaria de saber mais sobre os planos.');
    window.open(`https://wa.me/5511978786184?text=${msg}`, '_blank');
  }
</script>

<template>
  <div>
    <section>
      <UCard :ui="{ body: 'bg-foreground' }">

        <!-- MOBILE -->
        <UCarousel
          class="lg:hidden"
          v-slot="{ item }"
          loop
          dots
          :autoplay="{ delay: 2000 }"
          :items="advantageIcons"
          :ui="{ 
            item: 'basis-full',
            dot: 'data-[state=active]:bg-accent size-3'
          }"
        >
          <AdvantageItem
            :icon="item.icon"
            :label="item.label"
          />
        </UCarousel>

        <div class="text-transparent lg:hidden">a</div>

        <!-- DESKTOP ==================== -->
        <div class="hidden lg:grid grid-cols-4 gap-px bg-gray-300">
          <AdvantageItem
            v-for="item in advantageIcons"
            :key="item.label"
            :icon="item.icon"
            :label="item.label"
          />
        </div>
      </UCard>
    </section>

    <!-- WHATSAPP BANNER -->
    <section class="pt-4">
      <UCard @click="handleBannerClick" :ui="{ body: 'bg-primary relative' }">
        <img
          src="/dog_banner.png"
          alt="Dog Banner Background"
          class="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.85] lg:object-[center_58%]"
        />

        <div class="lg:min-h-50 min-h-42 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-4 z-10 relative">
          <!-- left -->
          <div class="text-foreground">
            <img src="/eneli_studio_icons/eneli_studio_paw_inverted.png" class="lg:w-full w-[20%]" />
          </div>

          <!-- middle -->
          <div class="text-foreground lg:text-2xl text-start pb-4">
            <h4 class="pt-2">Fale agora com um médico veterinário e tire suas dúvidas!</h4>
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