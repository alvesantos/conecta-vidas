<script setup lang="ts">
const handleScrollToPricing = () => {
  document.getElementById('pricingSection')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
</script>

<template>
  <div class="px-4 lg:px-6">
    <!-- DESKTOP -->
    <div class="justify-between items-center hidden lg:flex">
      <!-- CARD -->
      <div class="max-w-[30%] pb-1 cursor-pointer" @click="handleScrollToPricing">
        <UCard 
          :ui="{body: 'bg-primary'}"
          >
          <div class="flex items-center gap-4">
            <!-- ICON -->
            <div class="shrink-0">
              <img
                class="w-20 h-20 object-contain"
                src="/eneli_studio_icons/eneli_studio_pet_shield.png"
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
                mais precisar pode custar menos de dois reais por dia!
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- CHIP -->
      <div class="text-white max-w-75">
        <UCard class="p-0"
          :ui="{body: 'bg-foreground'}"
          >
          <div class="flex items-center gap-x-2">
            <!-- ICON -->
            <div class="shrink-0">
              <UAvatar class="border-2 border-accent" src="/cute_dog_doctor.png" size="3xl"/>
            </div>

            <!-- CONTENT -->
            <div class="min-w-0">
              <p class=" font-semibold leading-tight text-primary text-center">
                Atendimento com médicos veterinários <span class="text-accent">qualificados</span>
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- MOBILE =================================== -->
     <div class="lg:hidden ">
      <div>
        <!-- CARD -->
        <div class="pt-4 cursor-pointer" @click="handleScrollToPricing">
          <UCard 
            :ui="{body: 'bg-primary'}"
            >
            <div class="flex items-center gap-4 ">
              <!-- ICON -->
              <div class="shrink-0">
                <img
                  class="w-10 h-10 object-contain"
                  src="/eneli_studio_icons/eneli_studio_pet_shield.png"
                  alt="dog-shield"
                />
              </div>

              <!-- CONTENT -->
              <div class="min-w-0">
                <h3 class="font-semibold leading-tight text-foreground">
                  Assine agora e tenha segurança!
                </h3>

                <p class="pt-3 text-white/80 leading-snug text-sm">
                  Saber agir quando seu filho de quatro patas
                  mais precisar pode custar menos de dois reais por dia!
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      
      <div class="pt-4">
        <UCard 
          :ui="{body: 'bg-foreground'}"
          >
          <div class="flex items-center gap-x-2">
            <!-- ICON -->
            <div class="shrink-0">
              <UAvatar class="border-2 border-accent" src="/cute_dog_doctor.png" size="3xl"/>
            </div>

            <!-- CONTENT -->
            <div class="min-w-0">
              <p class=" font-semibold leading-tight text-primary">
                Atendimento com médicos veterinários <span class="text-accent">qualificados</span>
              </p>
            </div>
          </div>
        </UCard>
      </div>
     </div>
  </div>
</template>