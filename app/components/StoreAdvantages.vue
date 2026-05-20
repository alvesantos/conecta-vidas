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
      <UCard :ui="{ body: 'bg-primary relative' }">
        <img
          src="/dog_banner.png"
          alt="Dog Banner Background"
          class="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.85] lg:object-[center_60%]"
        />

        <div class="lg:min-h-60 min-h-42 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-4 z-10 relative">
          <!-- left -->
          <div class="text-foreground">
            <img src="/eneli_studio_icons/eneli_studio_paw_inverted.png" />
          </div>

          <!-- middle -->
          <div class="text-foreground lg:text-2xl text-start">
            <h4>Fale agora com um médico veterinário e tire suas dúvidas!</h4>
            <p class="text-lg text-foreground/60">Orientação profissional na palma da sua mão.</p>
          </div>

          <!-- right -->
          <div class="text-foreground text-bottom">
            button
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
<style scoped>
</style>