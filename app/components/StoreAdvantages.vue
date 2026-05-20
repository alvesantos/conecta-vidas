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
      <UCard :ui="{ body: 'bg-primary' }">
        <div class="min-h-42">hey</div>
      </UCard>
    </section>
  </div>
</template>
<style scoped>
</style>