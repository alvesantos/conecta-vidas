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
    <!-- DESKTOP (≥1024px) -->
    <div class="justify-between items-center hidden lg:flex">
      <!-- CARD -->
      <div class="max-w-[30%] min-[900px]:max-w-[48%] pb-1 cursor-pointer" @click="handleScrollToPricing">
        <UCard
          :ui="{body: 'bg-primary'}"
          >
          <div class="flex items-center gap-4 min-[900px]:gap-3">
            <!-- ICON -->
            <div class="shrink-0">
              <img
                class="w-20 h-20 min-[900px]:w-14 min-[900px]:h-14 object-contain"
                src="/eneli_studio_icons/eneli_studio_pet_shield.png"
                alt="dog-shield"
              />
            </div>

            <!-- CONTENT -->
            <div class="min-w-0">
              <h3 class="text-2xl min-[900px]:text-lg font-semibold leading-tight text-foreground">
                Assine agora e tenha segurança!
              </h3>

              <p class="pt-3 min-[900px]:pt-2 text-white/80 leading-snug min-[900px]:text-sm">
                Saber agir quando seu filho de quatro patas
                mais precisar pode custar menos de dois reais por dia!
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- CHIP -->
      <div class="text-white max-w-75 min-[900px]:max-w-[48%]">
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
              <p class="font-semibold leading-tight text-primary text-center min-[900px]:text-sm">
                Atendimento com médicos veterinários <span class="text-accent">qualificados</span>
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- MOBILE / TABLET (< 1024px) -->
     <div class="lg:hidden">
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
