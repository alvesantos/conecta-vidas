<script setup lang="ts">
import subscriptionAd from '~/components/SubscriptionAd.vue';

definePageMeta({
  noPadding: true,
})
</script>

<template>
  <div>
    <div class="relative">
      <header>
        <img
          class="max-w-[50%] min-[900px]:max-w-[20%] pt-6 px-6 min-[900px]:pt-10 hidden min-[900px]:block absolute"
          src="/conectavet-extended-icon.png"
          alt="conectavet" />
      </header>

      <div>
        <section class="flex w-full justify-between">
        <!-- SIDE CONTENT -->
          <div class="lg:max-w-[30%] min-[900px]:max-w-[44%] max-w-[50%] max-h-full lg:pt-[150px] min-[900px]:pt-20 lg:px-4 min-[900px]:px-3 flex flex-col justify-between">
            <div class="side-content pl-4">
              <div class="min-[900px]:hidden">
                <img src="/icon-com-texto.png" />
              </div>

              <!-- TITLE -->
              <p class="text-lg min-[900px]:text-2xl lg:text-5xl">
                Seu pet merece o melhor cuidado,
                <span class="text-accent underline">onde você estiver</span>
              </p>

              <!-- DESCRIPTION DESKTOP/MEDIUM -->
              <p class="lg:text-lg min-[900px]:text-sm text-[.6rem] px-4 pt-8 hidden min-[900px]:block">
                Telemedicina veterinária com <span class="text-accent font-semibold">orientação, acolhimento e segurança</span> quando você mais precisar.
              </p>
            </div>
          </div>
          <!-- DOG BACKGROUND -->
          <div class="lg:max-w-[70%] min-[900px]:max-w-[56%] max-w-[50%] shrink-0 overflow-hidden">
            <img
              class="conectavet-dog w-full h-full object-cover object-[65%_center] scale-130 lg:scale-100"
              src="/cute_dog.png"
              alt="doggo" />
          </div>
        </section>

        <div>
        <!-- DESCRIPTION MOBILE -->
        <p class="min-[900px]:hidden text-[.6rem] px-4 pt-4">
          Telemedicina veterinária com <span class="text-accent font-semibold">orientação, acolhimento e segurança</span> quando você mais precisar.
        </p>
      </div>
      </div>


      <section class="w-full static lg:absolute lg:bottom-0">
        <SubscriptionAd />
      </section>
    </div>

    <div class="h-full">
      <!-- BENEFITS AND WHATSAPP BANNER -->
      <section class="pt-4 px-4 lg:px-6">
        <StoreAdvantages />
      </section>
    </div>

    <!-- PRICES -->
    <div ref="pricingSection" id="pricingSection" class="pt-4 px-4 lg:px-6">
      <PrincingSection />
    </div>

    <!-- PARCERIAS -->
    <div class="pt-8 px-4 lg:px-6 flex flex-col items-center max-w-4xl mx-auto text-center">
      <h3 class="text-primary dark:text-gray-100 text-xl sm:text-2xl lg:text-3xl font-semibold mb-6">
        Tem Clínica Veterinária? Faça parte da Rede ConectaVet.
      </h3>
      <img src="/images/img-parcerias.png" alt="Parcerias ConectaVet" class="w-full rounded-2xl shadow-lg border border-accent/20" />
      <UButton
        to="https://wa.me/5511978654921?text=Oi%2C%20tenho%20uma%20cl%C3%ADnica%20e%20gostaria%20de%20ser%20parceiro%20ConectaVet"
        target="_blank"
        icon="i-mdi-whatsapp"
        size="lg"
        class="mt-6 font-semibold text-lg px-8 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white"
      >
        Seja Parceiro
      </UButton>
    </div>

    <!-- VIDEOAULAS CAROUSEL -->
    <div class="pt-8 px-4 lg:px-6">
      <VideoLessonsCarousel />
    </div>

    <!-- PAYMENT METHODS -->
    <div class=" pt-4 px-4 lg:px-6">
      <div class="grid grid-cols-4 p-4 gap-px border items-center text-center rounded-xl border-accent/70 divide-x divide-accent/70" >
        <div>
          <UIcon name="i-ph-lock" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">
            100% seguro
          </div>
        </div>
        <div>
          <UIcon name="i-ph-pix-logo" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">
            Pix
          </div>
        </div>
        <div>
          <UIcon name="i-ph-credit-card" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">
            Cartão de crédito
          </div>
        </div>
        <div>
          <UIcon name="i-ph-barcode" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">
            Boleto bancário
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-content {
  & > :nth-child(2) {
    font-family:
      "Recoleta", "DM Serif Display", Georgia, serif;
    font-weight: 600;
  }
}

/* Mobile */
.conectavet-dog {
  mask-image: linear-gradient(to left, white 0%, white 60%, transparent 85%);
  -webkit-mask-image: linear-gradient(to left, white 0%, white 60%, transparent 85%);
}

/* Medium screens (notebooks) */
@media (min-width: 900px) {
  .conectavet-dog {
    mask-image: linear-gradient(to left, white 0%, white 68%, transparent 92%);
    -webkit-mask-image: linear-gradient(to left, white 0%, white 68%, transparent 92%);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .conectavet-dog {
    mask-image: linear-gradient(to left, white 0%, white 76%, transparent 96%);
    -webkit-mask-image: linear-gradient(to left, white 0%, white 76%, transparent 96%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
}
</style>
