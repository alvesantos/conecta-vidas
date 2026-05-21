<script setup lang="ts">
import subscriptionAd from '~/components/SubscriptionAd.vue';

definePageMeta({
  noPadding: true
})
</script>

<template>
  <div>
    <div class="relative">
      <header>
        <img 
          class="max-w-[50%] md:max-w-[20%] pt-6 px-6 md:pt-10 hidden md:block absolute"
          src="/conectavet-extended-icon.png"
          alt="conectavet" />
      </header>

      <div>
        <section class="flex w-full justify-between">
        <!-- SIDE CONTENT -->
          <div class="lg:max-w-[30%] max-w-[50%] max-h-full lg:pt-[150px] lg:px-4 flex flex-col justify-between">
            <div class="side-content pl-4">
              <div class="lg:hidden">
                <img src="/icon-com-texto.png" />
              </div>

              <!-- TITLE -->
              <p class="text-lg lg:text-5xl">
                Seu pet merece o melhor cuidado,
                <span class="text-accent underline">onde você estiver</span>
              </p>

              <!-- DESCRIPTION DESKTOP -->
              <p class="lg:text-lg text-[.6rem] px-4 pt-8 hidden lg:block">
                Telemedicina veterinária com <span class="text-accent font-semibold">orientação, acolhimento e segurança</span> quando você mais precisar.
              </p>
            </div>
          </div>
          <!-- DOG BACKGROUND -->
          <div class="lg:max-w-[70%] max-w-[50%] shrink-0 overflow-hidden">
            <img
              class="conectavet-dog w-full h-full object-cover object-[65%_center] scale-130 lg:scale-100"
              src="/cute_dog.png"
              alt="doggo" />
          </div>
        </section>

        <div>
        <!-- DESCRIPTION MOBILE -->
        <p class="lg:hidden lg:text-lg text-[.6rem] px-4 pt-4">
          Telemedicina veterinária com <span class="text-accent font-semibold">orientação, acolhimento e segurança</span> quando você mais precisar.
        </p>
      </div>
      </div>


      <section class="w-full lg:absolute lg:bottom-0 static">
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

/* Desktop */
@media (min-width: 1024px) {
  .conectavet-dog {
    mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 76%,
        transparent 96%
      );

    -webkit-mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 76%,
        transparent 96%
      );

    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
}

/* Mobile */
@media (max-width: 1023px) {
  .conectavet-dog {
    mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 60%,
        transparent 85%
      );

    -webkit-mask-image:
      linear-gradient(
        to left,
        white 0%,
        white 60%,
        transparent 85%
      );
  }
}
</style>