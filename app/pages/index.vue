<script setup lang="ts">
definePageMeta({
  noPadding: true,
});

function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const heroFeatures = [
  { icon: "i-heroicons-shield-check", label: "Atendimento seguro e sigiloso" },
  {
    icon: "i-heroicons-calendar-days",
    label: "Quando precisar, e onde estiver",
  },
  { icon: "i-mdi-paw", label: "Foco no bem-estar da família toda" },
  { icon: "i-heroicons-academic-cap", label: "Profissionais qualificados" },
];
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-10 xl:px-20 pb-12">
    <!-- TOP BANNER -->
    <div class="pt-5">
      <div
        class="flex items-center justify-center gap-2.5 rounded-full bg-accent/8 dark:bg-white/5 px-5 py-2.5 text-center"
      >
        <UIcon name="i-heroicons-heart" class="size-5 text-accent shrink-0" />
        <p class="text-sm sm:text-base text-primary/80 dark:text-gray-300">
          Uma plataforma de telemedicina que conecta a saúde de toda a família,
          <span class="font-semibold text-primary dark:text-white"
            >incluindo seus pets.</span
          >
        </p>
      </div>
    </div>

    <!-- HERO -->
    <section class="pt-8 lg:pt-12">
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <!-- LEFT: CONTENT -->
        <div class="flex flex-col order-2 lg:order-1">
          <span
            class="self-start inline-flex items-center rounded-full bg-primary text-white text-xs font-semibold tracking-wide px-3.5 py-1.5 uppercase"
          >
            Telemedicina Veterinária &amp; Humana
          </span>

          <!-- TITLE -->
          <h1
            class="hero-title mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-primary dark:text-white"
          >
            Saúde para toda a família.
            <span class="text-accent">Incluindo quem late, mia e te ama.</span>
          </h1>

          <!-- SUBTITLE -->
          <p
            class="mt-5 text-base sm:text-lg text-primary/70 dark:text-gray-300 max-w-xl"
          >
            Consultas online, orientação especializada e muito mais para cuidar
            de quem você ama, onde estiver.
          </p>

          <!-- BUTTONS -->
          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <UButton
              size="xl"
              color="primary"
              trailing-icon="i-mdi-paw"
              class="justify-center font-semibold px-6"
              @click="scrollToId('card-pet')"
            >
              Quero cuidar do meu pet
            </UButton>
            <UButton
              size="xl"
              color="primary"
              variant="outline"
              trailing-icon="i-heroicons-user"
              class="justify-center font-semibold px-6"
              @click="scrollToId('card-voce')"
            >
              Quero cuidar de mim
            </UButton>
          </div>

          <!-- FEATURES -->
          <div class="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5">
            <div
              v-for="feature in heroFeatures"
              :key="feature.label"
              class="flex flex-col items-start gap-2"
            >
              <span
                class="flex items-center justify-center size-9 rounded-full bg-accent/10 text-accent"
              >
                <UIcon :name="feature.icon" class="size-5" />
              </span>
              <span
                class="text-xs sm:text-sm text-primary/70 dark:text-gray-300 leading-snug"
              >
                {{ feature.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT: IMAGE -->
        <div class="relative order-1 lg:order-2">
          <!-- TODO: substituir pela imagem definitiva da hero -->
          <div
            class="aspect-4/3 rounded-3xl overflow-hidden bg-linear-to-br from-primary to-accent shadow-xl"
          >
            <img
              src="/cute_dog.png"
              alt="Cuidado que conecta vidas"
              class="w-full h-full object-cover object-center"
            />
          </div>

          <!-- SELO -->
          <div
            class="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col items-center justify-center size-24 sm:size-28 rounded-full bg-white/95 dark:bg-primary backdrop-blur shadow-lg border-2 border-accent/30 text-center"
          >
            <UIcon name="i-heroicons-heart" class="size-6 text-accent" />
            <span
              class="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-wide text-primary dark:text-white leading-tight px-2"
            >
              CUIDADO QUE CONECTA VIDAS
            </span>
          </div>

          <!-- CARD FLUTUANTE -->
          <div
            class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-56 flex items-start gap-2.5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg px-4 py-3"
          >
            <span
              class="flex items-center justify-center size-8 rounded-full bg-accent/10 text-accent shrink-0"
            >
              <UIcon name="i-mdi-paw" class="size-4" />
            </span>
            <p
              class="text-xs sm:text-sm text-primary/80 dark:text-gray-200 leading-snug"
            >
              Você e seu pet merecem cuidados onde estiverem.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARD ASSINE AGORA -->
    <section class="pt-10">
      <div
        class="rounded-3xl bg-primary text-white p-6 sm:p-8 cursor-pointer transition-transform hover:-translate-y-0.5"
        @click="scrollToId('pricingSection')"
      >
        <div class="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <!-- LEFT -->
          <div class="flex items-center gap-4 lg:max-w-md">
            <img
              src="/eneli_studio_icons/eneli_studio_pet_shield.png"
              alt="Proteção"
              class="size-16 sm:size-20 object-contain shrink-0"
            />
            <div>
              <h3 class="text-xl sm:text-2xl font-semibold leading-tight">
                Assine agora e tenha segurança!
              </h3>
              <p class="mt-2 text-sm sm:text-base text-white/70 leading-snug">
                Saber agir quando seu filho de quatro patas mais precisar pode
                custar menos de dois reais por dia!
              </p>
            </div>
          </div>

          <!-- RIGHT: BENEFITS -->
          <div class="lg:ml-auto grid sm:grid-cols-1 gap-3">
            <div class="flex items-center gap-2.5">
              <UIcon
                name="i-heroicons-check-circle"
                class="size-5 text-green-400 shrink-0"
              />
              <span class="text-sm sm:text-base text-white/90"
                >Telemedicina veterinária 24/7</span
              >
            </div>
            <div class="flex items-center gap-2.5">
              <UIcon
                name="i-heroicons-check-circle"
                class="size-5 text-green-400 shrink-0"
              />
              <span class="text-sm sm:text-base text-white/90"
                >Orientação, acolhimento e segurança</span
              >
            </div>
            <div class="flex items-center gap-2.5">
              <UIcon
                name="i-heroicons-check-circle"
                class="size-5 text-green-400 shrink-0"
              />
              <span class="text-sm sm:text-base text-white/90"
                >Descontos exclusivos em parceiros</span
              >
            </div>
            <div class="flex items-center gap-2.5">
              <UIcon
                name="i-heroicons-calendar-days"
                class="size-5 text-white/80 shrink-0"
              />
              <span class="text-sm sm:text-base text-white/90"
                >Telemedicina humana agendada</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CARDS PARA PET / PARA VOCÊ -->
    <section class="pt-6">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- PARA SEU PET -->
        <div
          id="card-pet"
          class="rounded-3xl border border-accent/20 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-sm flex flex-col"
        >
          <div class="flex items-center gap-4">
            <span
              class="flex items-center justify-center size-16 rounded-full bg-accent/10 text-accent shrink-0"
            >
              <UIcon name="i-mdi-paw" class="size-8" />
            </span>
            <h3 class="hero-title text-2xl sm:text-3xl text-accent">
              Para seu Pet
            </h3>
          </div>
          <p class="mt-4 text-primary/70 dark:text-gray-300 leading-relaxed">
            Teleconsulta veterinária, orientação, acompanhamento e muito mais
            para todas as fases da vida do seu melhor amigo.
          </p>
          <UButton
            to="/solicitar-consulta"
            size="lg"
            color="primary"
            class="mt-6 self-start font-semibold px-6"
            trailing-icon="i-heroicons-arrow-right"
          >
            Conhecer serviços para pets
          </UButton>
        </div>

        <!-- PARA VOCÊ -->
        <div
          id="card-voce"
          class="rounded-3xl border border-green-600/20 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-sm flex flex-col"
        >
          <div class="flex items-center gap-4">
            <span
              class="flex items-center justify-center size-16 rounded-full bg-green-600/10 text-green-600 shrink-0"
            >
              <UIcon name="i-heroicons-user" class="size-8" />
            </span>
            <h3
              class="hero-title text-2xl sm:text-3xl text-green-700 dark:text-green-500"
            >
              Para Você
            </h3>
          </div>
          <p class="mt-4 text-primary/70 dark:text-gray-300 leading-relaxed">
            Consultas médicas online, especialistas, exames, saúde mental e
            programas de prevenção para você e sua família.
          </p>
          <UButton
            to="https://wa.me/5511978654921?text=Oi%2C%20gostaria%20de%20conhecer%20os%20servi%C3%A7os%20de%20telemedicina%20humana"
            target="_blank"
            size="lg"
            color="success"
            class="mt-6 self-start font-semibold px-6"
            trailing-icon="i-heroicons-arrow-right"
          >
            Conhecer serviços para você
          </UButton>
        </div>
      </div>
    </section>

    <div class="h-full">
      <!-- BENEFITS AND WHATSAPP BANNER -->
      <section class="pt-4">
        <StoreAdvantages />
      </section>
    </div>

    <!-- PRICES -->
    <div ref="pricingSection" id="pricingSection" class="pt-4">
      <PrincingSection />
    </div>

    <!-- PARCERIAS -->
    <div class="pt-8 flex flex-col items-center text-center">
      <h3
        class="text-primary dark:text-gray-100 text-xl sm:text-2xl lg:text-3xl font-semibold mb-6"
      >
        Tem Clínica Veterinária? Faça parte da Rede ConectaVet.
      </h3>
      <img
        src="/images/img-parcerias.png"
        alt="Parcerias ConectaVet"
        class="w-full rounded-2xl shadow-lg border border-accent/20"
      />
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
    <div class="pt-8">
      <VideoLessonsCarousel />
    </div>

    <!-- PAYMENT METHODS -->
    <div class="pt-4">
      <div
        class="grid grid-cols-4 p-4 gap-px border items-center text-center rounded-xl border-accent/70 divide-x divide-accent/70"
      >
        <div>
          <UIcon name="i-ph-lock" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">100% seguro</div>
        </div>
        <div>
          <UIcon name="i-ph-pix-logo" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">Pix</div>
        </div>
        <div>
          <UIcon name="i-ph-credit-card" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">
            Cartão de crédito
          </div>
        </div>
        <div>
          <UIcon name="i-ph-barcode" class="size-7 lg:size-8" />
          <div class="text-center sm:text-sm text-[.5rem]">Boleto bancário</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-title {
  font-family: "Recoleta", "DM Serif Display", Georgia, serif;
  font-weight: 600;
}
</style>
