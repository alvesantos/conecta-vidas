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

const howItWorks = [
  {
    icon: "i-heroicons-user-plus",
    title: "Cadastre-se",
    desc: "Crie sua conta em poucos minutos. Cadastrar um pet é opcional e pode ser feito depois.",
  },
  {
    icon: "i-heroicons-credit-card",
    title: "Escolha um plano",
    desc: "Assine o plano ideal e tenha consultas incluídas todos os meses, com descontos exclusivos.",
  },
  {
    icon: "i-heroicons-video-camera",
    title: "Fale com o profissional",
    desc: "Agende e converse por vídeo com um veterinário ou médico, de onde você estiver.",
  },
];

const services = [
  {
    icon: "i-heroicons-document-check",
    title: "Atestados",
    desc: "Atestados médicos com validade e segurança, sem sair de casa.",
  },
  {
    icon: "i-heroicons-clipboard-document-list",
    title: "Relatórios",
    desc: "Relatórios médicos completos para diversas finalidades.",
  },
  {
    icon: "i-heroicons-document-text",
    title: "Receitas",
    desc: "Receitas médicas digitais, válidas e seguras.",
  },
  {
    icon: "i-heroicons-arrow-path",
    title: "Renovação de receitas",
    desc: "Renove suas receitas de uso contínuo de forma prática e rápida.",
  },
  {
    icon: "i-heroicons-paper-airplane",
    title: "Encaminhamentos",
    desc: "Encaminhamentos para especialistas, exames e tratamentos.",
  },
  {
    icon: "i-heroicons-document-magnifying-glass",
    title: "Avaliação de laudos",
    desc: "Análise e orientação de exames e laudos por médicos qualificados.",
  },
  {
    icon: "i-mdi-heart-pulse",
    title: "Acompanhamento clínico",
    desc: "Acompanhamento da sua saúde ao longo do tempo, com cuidado contínuo.",
  },
  {
    icon: "i-heroicons-user-circle",
    title: "Atendimento com médicos qualificados",
    desc: "Atendimento humanizado com médicos experientes e prontos para te ajudar.",
  },
  {
    icon: "i-heroicons-user-group",
    title: "Atendimento para todas as idades",
    desc: "Cuidado completo para crianças, adolescentes, adultos e idosos.",
  },
];

const faqItems = [
  {
    q: "As consultas são realmente online?",
    a: "Sim. O atendimento acontece por vídeo, dentro da própria plataforma, onde quer que você esteja.",
  },
  {
    q: "Vocês atendem pets e pessoas?",
    a: "Sim, oferecemos telemedicina veterinária e humana para cuidar de toda a família.",
  },
  {
    q: "Preciso ter um pet para me cadastrar?",
    a: "Não. O cadastro de pet é opcional e pode ser feito a qualquer momento na área Meus Animais.",
  },
  {
    q: "Quantas consultas o plano inclui?",
    a: "Depende do plano escolhido. Cada um inclui um número de consultas gratuitas por mês.",
  },
  {
    q: "Como falo com um profissional?",
    a: "Agende pela plataforma ou pelo WhatsApp; você recebe o link da sala para entrar na hora da consulta.",
  },
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
      <div
        class="relative min-h-145 lg:min-h-170 overflow-hidden rounded-4xl bg-primary bg-[url('/background-hero.png')] bg-cover bg-position-[58%_center] shadow-2xl"
      >
        <div
          class="absolute inset-0 bg-linear-to-r from-primary via-primary/72 to-primary/8"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-primary/52 via-transparent to-transparent"
        />

        <div
          class="relative z-10 flex min-h-145 lg:min-h-170 flex-col justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16"
        >
          <div class="max-w-2xl">
            <span
              class="self-start inline-flex items-center rounded-full bg-accent text-white text-xs font-semibold tracking-wide px-3.5 py-1.5 uppercase shadow-lg shadow-primary/20"
            >
              Telemedicina Veterinária &amp; Humana
            </span>

            <!-- TITLE -->
            <h1
              class="hero-title mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white"
            >
              Saúde para toda a família.
              <span class="text-sky-200">Incluindo quem late, mia e te ama.</span>
            </h1>

            <!-- SUBTITLE -->
            <p class="mt-5 max-w-xl text-base sm:text-lg text-white/80">
              Consultas online, orientação especializada e muito mais para
              cuidar de quem você ama, onde estiver.
            </p>

            <!-- BUTTONS -->
            <div class="mt-7 flex flex-col sm:flex-row gap-3">
              <UButton
                size="xl"
                color="primary"
                trailing-icon="i-mdi-paw"
                class="justify-center font-semibold px-6 bg-white! text-primary! hover:bg-white/90!"
                @click="scrollToId('card-pet')"
              >
                Quero cuidar do meu pet
              </UButton>
              <UButton
                size="xl"
                color="primary"
                variant="outline"
                trailing-icon="i-heroicons-user"
                class="justify-center font-semibold px-6 text-white! ring-white/45! hover:bg-white/10!"
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
                  class="flex items-center justify-center size-9 rounded-full bg-white/15 text-white ring-1 ring-white/20"
                >
                  <UIcon :name="feature.icon" class="size-5" />
                </span>
                <span class="text-xs sm:text-sm text-white/80 leading-snug">
                  {{ feature.label }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="absolute bottom-28 right-5 hidden size-24 flex-col items-center justify-center rounded-full border-2 border-accent/30 bg-white/95 text-center shadow-lg backdrop-blur sm:right-8 sm:flex sm:size-28 lg:bottom-auto lg:left-[48%] lg:right-auto lg:top-28"
          >
            <UIcon name="i-heroicons-heart" class="size-6 text-accent" />
            <span
              class="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-wide text-primary leading-tight px-2"
            >
              CUIDADO QUE CONECTA VIDAS
            </span>
          </div>

          <div
            class="absolute bottom-5 right-5 max-w-56 items-start gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-lg hidden sm:flex sm:bottom-8 sm:right-8"
          >
            <span
              class="flex items-center justify-center size-8 rounded-full bg-accent/10 text-accent shrink-0"
            >
              <UIcon name="i-mdi-paw" class="size-4" />
            </span>
            <p
              class="text-xs sm:text-sm text-primary/80 leading-snug"
            >
              Você e seu pet merecem cuidados onde estiverem.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARD ASSINE AGORA -->
    <section class="pt-16 sm:pt-20">
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
    <section class="pt-16 sm:pt-20">
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
            class="mt-6 self-start font-semibold px-6 dark:bg-accent! dark:text-white! dark:hover:bg-accent/85!"
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

    <!-- SERVIÇOS / TÓPICOS -->
    <section class="pt-16 sm:pt-20">
      <div class="text-center max-w-2xl mx-auto">
        <span
          class="inline-flex items-center rounded-full bg-accent/10 dark:bg-white/10 text-accent dark:text-white text-xs font-semibold tracking-wide px-3.5 py-1.5 uppercase"
        >
          Tudo em um só lugar
        </span>
        <h2
          class="hero-title mt-4 text-3xl sm:text-4xl lg:text-5xl text-primary dark:text-white"
        >
          O que você encontra
        </h2>
        <p class="mt-3 text-body-muted text-base sm:text-lg">
          Documentos, orientação e acompanhamento — com médicos qualificados,
          onde você estiver.
        </p>
      </div>

      <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="service in services"
          :key="service.title"
          class="group flex items-start gap-4 rounded-3xl border border-accent/15 dark:border-white/10 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
        >
          <span
            class="flex items-center justify-center size-12 shrink-0 rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white"
          >
            <UIcon :name="service.icon" class="size-6" />
          </span>
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-primary dark:text-white leading-tight">
              {{ service.title }}
            </h3>
            <p class="mt-1.5 text-body-muted text-sm leading-relaxed">
              {{ service.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section class="pt-16 sm:pt-20">
      <div class="text-center max-w-2xl mx-auto">
        <span
          class="inline-flex items-center rounded-full bg-accent/10 dark:bg-white/10 text-accent dark:text-white text-xs font-semibold tracking-wide px-3.5 py-1.5 uppercase"
        >
          Simples assim
        </span>
        <h2
          class="hero-title mt-4 text-3xl sm:text-4xl lg:text-5xl text-primary dark:text-white"
        >
          Como funciona
        </h2>
        <p class="mt-3 text-body-muted text-base sm:text-lg">
          Do cadastro à consulta, em poucos minutos, para o seu pet e para você.
        </p>
      </div>

      <div class="mt-12 grid md:grid-cols-3 gap-6">
        <div
          v-for="(step, i) in howItWorks"
          :key="step.title"
          class="relative rounded-3xl border border-accent/15 dark:border-white/10 bg-white dark:bg-gray-800 p-7 shadow-sm"
        >
          <span
            class="absolute -top-4 left-7 flex items-center justify-center size-9 rounded-full bg-accent text-white text-sm font-bold shadow"
          >
            {{ i + 1 }}
          </span>
          <span
            class="flex items-center justify-center size-12 rounded-2xl bg-accent/10 text-accent"
          >
            <UIcon :name="step.icon" class="size-6" />
          </span>
          <h3 class="mt-5 text-lg font-semibold text-primary dark:text-white">
            {{ step.title }}
          </h3>
          <p class="mt-2 text-body-muted text-sm leading-relaxed">
            {{ step.desc }}
          </p>
        </div>
      </div>
    </section>

    <div class="h-full pt-16 sm:pt-20">
      <!-- BENEFITS AND WHATSAPP BANNER -->
      <section>
        <StoreAdvantages />
      </section>
    </div>

    <!-- PRICES -->
    <div ref="pricingSection" id="pricingSection" class="pt-16 sm:pt-20">
      <PrincingSection />
    </div>

    <!-- VIDEOAULAS CAROUSEL -->
    <div class="pt-16 sm:pt-20">
      <VideoLessonsCarousel />
    </div>

    <!-- FAQ -->
    <section class="pt-16 sm:pt-20">
      <div class="text-center max-w-2xl mx-auto">
        <span
          class="inline-flex items-center rounded-full bg-accent/10 dark:bg-white/10 text-accent dark:text-white text-xs font-semibold tracking-wide px-3.5 py-1.5 uppercase"
        >
          Tire suas dúvidas
        </span>
        <h2
          class="hero-title mt-4 text-3xl sm:text-4xl lg:text-5xl text-primary dark:text-white"
        >
          Perguntas frequentes
        </h2>
      </div>

      <div class="mt-10 max-w-3xl mx-auto flex flex-col gap-3">
        <details
          v-for="item in faqItems"
          :key="item.q"
          class="group rounded-2xl border border-accent/15 dark:border-white/10 bg-white dark:bg-gray-800 px-5 sm:px-6 shadow-sm"
        >
          <summary
            class="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-semibold text-primary dark:text-white"
          >
            {{ item.q }}
            <UIcon
              name="i-heroicons-chevron-down"
              class="size-5 shrink-0 text-accent dark:text-white transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p class="pb-5 -mt-1 text-body-muted text-sm sm:text-base leading-relaxed">
            {{ item.a }}
          </p>
        </details>
      </div>
    </section>

    <!-- PAYMENT METHODS -->
    <div class="pt-16 sm:pt-20">
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
