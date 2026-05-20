<script setup lang="ts">
defineProps<{
  reduced: {
    type: boolean,
    default: true
  }
}>()


</script>

<template>
  <div>
    <UCard class="p-4">
      <h4 class="lg:block hidden lg:text-2xl font-semibold text-primary text-center mb-4">Assine e tenha acesso a conteúdos exclusivos de primeiros socorros e cuidados com seu pet.</h4>

      <div class="lg:flex lg:justify-around">
        <p>plan1</p>
        <p>plan2</p>
        <p>plan3</p>
      </div>
    </UCard>
  </div>
</template>