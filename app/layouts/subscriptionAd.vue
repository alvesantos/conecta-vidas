<script setup lang="ts">
</script>

<template>
  <div class="px-2 lg:px-6">
    <!-- DESKTOP -->
    <div class="flex justify-between hidden lg:flex">
      <!-- CARD -->
      <div class="max-w-[30%] pb-1">
        <UCard 
          :ui="{body: 'bg-accent'}"
          >
          <div class="flex items-center gap-4">
            <!-- ICON -->
            <div class="shrink-0">
              <img
                class="w-20 h-20 object-contain"
                src="/dot_k_icons/dot_k_pet_shield.png"
                alt="dog-shield"
              />
            </div>

            <!-- CONTENT -->
            <div class="min-w-0">
              <h3 class="text-2xl font-semibold leading-tight text-foreground">
                Assine agora e tenha segurança!
              </h3>

              <p class="pt-3 text-white/80 leading-snug">
                Saber agir quando seu filho de quatro patas
                mais precisar pode custar apenas 1 real por dia!
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- CHIP -->
      <div class="text-white">
        <UCard 
          :ui="{body: 'bg-foreground'}"
          >
          <div class="flex items-center gap-4">
            <!-- ICON -->
            <div class="shrink-0">
              <UAvatar src="/cute_dog_doctor.png" size="3xl"/>
            </div>

            <!-- CONTENT -->
            <div class="min-w-0">
              <p class="text-2xl font-semibold leading-tight text-primary">
                Atendimento com médicos veterinários <span class="text-accent">qualificados</span>
              </p>

              <p class="pt-3 text-primary/80 leading-snug">
                Entre em contato conosco através do WhatsApp
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- MOBILE -->
     <div class="flex justify-between lg:hidden">
      <div class="">hi mobile</div>
      <div class="">hey mobile</div>
     </div>
  </div>
</template>