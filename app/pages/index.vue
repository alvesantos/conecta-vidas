<script setup lang="ts">
import { portalForUser } from "~/config/portals";

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
  { icon: "i-mdi-stethoscope", label: "Foco no bem-estar da família toda" },
  { icon: "i-heroicons-academic-cap", label: "Profissionais qualificados" },
];

const { user, isLoggedIn } = useAuth();
const clientPortalTarget = computed(() =>
  isLoggedIn.value && user.value
    ? portalForUser(user.value.type).home
    : "/login?portal=cliente&redirect=/painel/cliente",
);

const howItWorks = [
  {
    icon: "i-heroicons-user-plus",
    title: "Cadastre-se",
    desc: "Crie sua conta em poucos minutos. Cadastrar um animal é opcional e pode ser feito depois.",
  },
  {
    icon: "i-heroicons-squares-2x2",
    title: "Escolha entre medicina humana e veterinária",
    desc: "Selecione o tipo de atendimento que você precisa e encontre o profissional certo.",
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
    q: "O que é a Telemedicina Humana?",
    a: "É o exercício da medicina mediado por Tecnologias Digitais de Informação e Comunicação (TDICs), permitindo a prestação de serviços de assistência à saúde, prevenção de doenças, emissão de laudos, relatórios, atestados médicos, gestão e promoção da saúde. No Brasil, a prática é respaldada pela Lei Federal nº 14.510/2022 e regulamentada pela Resolução CFM nº 2.314/2022, garantindo autonomia ao médico, segurança jurídica, privacidade e confidencialidade aos dados dos pacientes.",
  },
  {
    q: "O que é a Telemedicina Veterinária?",
    a: "É a prestação de serviços médico-veterinários mediada por tecnologias digitais de informação e comunicação. No Brasil, a prática é regulamentada pela Resolução CFMV nº 1.465/2022, permitindo modalidades como teleconsulta, telemonitoramento e telediagnóstico, desde que observados os critérios éticos, de segurança digital e, quando aplicável, a existência prévia de relação presencial entre o médico-veterinário, o paciente e o tutor.",
  },
  {
    q: "Existe algum risco de misturar a telemedicina humana com a veterinária dentro da plataforma?",
    a: "Não. O ConectaVidas não mistura a telemedicina humana com a veterinária. Trata-se de dois ecossistemas completamente independentes e distintos. Separamos rigorosamente os prontuários, os bancos de dados e as equipes médicas de cada segmento, cumprindo à risca todas as exigências estabelecidas pelos respectivos conselhos de classe profissionais. Além disso, contamos com servidores dedicados e políticas de LGPD (Lei Geral de Proteção de Dados) personalizadas para garantir total privacidade e segurança jurídica entre o atendimento de humanos e animais. Cada uma das áreas possui, ainda, seu próprio Diretor Técnico responsável, devidamente habilitado e capacitado para a sua respectiva profissão.",
  },
  {
    q: "A telemedicina atende pessoas de todas as idades?",
    a: "Sim. O ConectaVidas oferece atendimento para pessoas de todas as idades, desde crianças até idosos, sempre respeitando as necessidades individuais de cada paciente e os critérios de avaliação médica.",
  },
  {
    q: "Preciso ter um animal para realizar uma consulta médica para mim?",
    a: "Não. O ConectaVidas oferece telemedicina humana e veterinária de forma independente. Você pode utilizar os serviços médicos mesmo que não possua um animal.",
  },
  {
    q: "Os profissionais do ConectaVidas são de confiança?",
    a: "Sim. Todos os médicos possuem registro ativo no Conselho Regional de Medicina (CRM), e todos os médicos-veterinários possuem registro ativo no Conselho Regional de Medicina Veterinária (CRMV). Além disso, os profissionais passam por um rigoroso processo de credenciamento e seleção, garantindo um atendimento ético, seguro e realizado por profissionais qualificados.",
  },
  {
    q: "Quais casos podem ser atendidos por telemedicina?",
    a: "A telemedicina é indicada para situações de baixa complexidade ou acompanhamentos, incluindo sintomas leves, renovação de receitas recorrentes, pedidos de exames complementares, acompanhamento de tratamento de condições crônicas, esclarecimento de dúvidas sobre condutas anteriores, orientações gerais de saúde para pacientes humanos e cuidados preventivos para animais, sempre conforme avaliação profissional.",
  },
  {
    q: "O que acontece se o meu caso ou o do meu animal for uma urgência?",
    a: "Casos de urgência e emergência não devem ser atendidos por telemedicina. ⚠️ Atenção: situações como acidentes graves, dificuldade respiratória intensa, dor torácica severa ou desmaios exigem atendimento presencial imediato. Nessas situações, a orientação é procurar o pronto-socorro, hospital ou serviço veterinário presencial mais próximo.",
  },
  {
    q: "Como faço para agendar uma consulta?",
    a: "O agendamento é simples e rápido. Basta escolher a modalidade desejada e clicar no botão “Agendar Consulta”. Você será direcionado imediatamente para o WhatsApp do ConectaVidas, onde nossa equipe de suporte concluirá o agendamento de forma personalizada e humanizada, encontrando o melhor dia e horário para você ou seu animal.",
  },
  {
    q: "Como recebo receitas, atestados e relatórios após a consulta?",
    a: "Todos os documentos, incluindo receitas, atestados, relatórios e pedidos de exames, são emitidos digitalmente e enviados por WhatsApp ou e-mail, observando os requisitos legais aplicáveis para sua validade e segurança.",
  },
  {
    q: "Preciso contratar um plano para realizar uma consulta?",
    a: "Não. Você pode realizar consultas humanas ou veterinárias de forma avulsa, sem a necessidade de contratar um plano.",
  },
];

// Scroll-reveal: revela elementos com a classe .reveal ao entrarem na tela
onMounted(() => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("reveal-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
});
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
            >incluindo seus animais.</span
          >
        </p>
      </div>
    </div>

    <!-- HERO -->
    <section class="pt-8 lg:pt-12 -mx-4 sm:mx-0">
      <div
        class="relative overflow-hidden rounded-none sm:rounded-4xl bg-primary shadow-2xl lg:min-h-170"
      >
        <!-- IMAGEM: banner no topo (mobile/tablet) e fundo absoluto (desktop) -->
        <div
          class="relative h-56 sm:h-80 lg:absolute lg:inset-0 lg:h-auto"
        >
          <div
            class="absolute inset-0 bg-[url('/background/background_hero_best.png')] bg-cover bg-position-[72%_20%] sm:bg-position-[62%_25%] lg:bg-position-[58%_center] lg:scale-x-[-1]"
          />
          <!-- Fade inferior p/ fundir a imagem no bloco (só mobile/tablet) -->
          <div
            class="lg:hidden absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-primary via-primary/60 to-transparent"
          />
          <!-- Overlays só no desktop -->
          <div
            class="hidden lg:block absolute inset-0 bg-linear-to-r from-primary from-0% via-primary/45 via-28% to-transparent to-55%"
          />
          <div
            class="hidden lg:block absolute inset-0 bg-linear-to-t from-primary/25 via-transparent to-transparent"
          />
        </div>

        <div
          class="relative z-10 px-6 pb-9 pt-3 sm:px-8 sm:pb-10 sm:pt-4 lg:flex lg:min-h-170 lg:flex-col lg:justify-center lg:px-12 lg:py-10 xl:px-16"
        >
          <div class="reveal max-w-2xl">
            <span
              class="self-start inline-flex items-center rounded-full bg-accent text-white text-[11px] sm:text-xs font-semibold tracking-wide px-3 py-1 sm:px-3.5 sm:py-1.5 uppercase shadow-lg shadow-primary/20"
            >
              Telemedicina Veterinária &amp; Humana
            </span>

            <!-- TITLE -->
            <h1
              class="hero-title mt-4 sm:mt-5 text-3xl sm:text-5xl lg:text-6xl leading-[1.08] sm:leading-[1.05] text-white"
            >
              Conectando medicinas,
              <span class="text-sky-200">unificando vidas.</span>
            </h1>

            <!-- SUBTITLE -->
            <p class="mt-4 sm:mt-5 max-w-xl text-sm sm:text-lg text-white/80">
              Telemedicina integrada para toda a família, com médicos para você e
              médicos veterinários para o seu animal.
            </p>

            <!-- BUTTONS -->
            <div class="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-3">
              <UButton
                :to="clientPortalTarget"
                size="xl"
                color="primary"
                trailing-icon="i-mdi-paw"
                class="justify-center font-semibold px-6 bg-white! text-primary! hover:bg-white/90!"
              >
                Acessar cuidado animal
              </UButton>
              <UButton
                :to="clientPortalTarget"
                size="xl"
                color="primary"
                variant="outline"
                trailing-icon="i-heroicons-user"
                class="justify-center font-semibold px-6 text-white! ring-white/45! hover:bg-white/10!"
              >
                Acessar cuidado humano
              </UButton>
            </div>

            <!-- FEATURES -->
            <div class="mt-7 sm:mt-9 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 sm:gap-y-5">
              <div
                v-for="feature in heroFeatures"
                :key="feature.label"
                class="flex flex-col items-center text-center sm:items-start sm:text-left gap-2"
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
            class="absolute bottom-8 right-8 max-w-56 items-start gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-lg hidden lg:flex"
          >
            <span
              class="flex items-center justify-center size-8 rounded-full bg-accent/10 text-accent shrink-0"
            >
              <UIcon name="i-mdi-paw" class="size-4" />
            </span>
            <p
              class="text-xs sm:text-sm text-primary/80 leading-snug"
            >
              Você e seu animal merecem cuidados onde estiverem.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA ASSINE -->
    <section class="pt-12 sm:pt-16">
      <div
        class="reveal flex flex-col items-center sm:flex-row sm:justify-center gap-x-3 gap-y-3 text-center"
      >
        <p class="text-base sm:text-lg text-primary/80 dark:text-gray-300">
          Segurança para você e seu animal por
          <span class="font-semibold text-primary dark:text-white"
            >menos de R$ 2 por dia.</span
          >
        </p>
        <UButton
          size="xl"
          variant="link"
          color="primary"
          trailing-icon="i-heroicons-arrow-right"
          class="font-semibold text-base sm:text-lg dark:text-sky-400!"
          @click="scrollToId('pricingSection')"
        >
          Ver planos
        </UButton>
      </div>
    </section>

    <!-- CARDS PARA PET / PARA VOCÊ -->
    <section class="pt-12 sm:pt-20">
      <div class="grid md:grid-cols-2 gap-5 sm:gap-6">
        <!-- PARA SEU PET -->
        <div
          id="card-pet"
          class="reveal rounded-3xl border border-accent/20 bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <span
              class="flex items-center justify-center size-14 sm:size-16 rounded-full bg-accent/10 text-accent shrink-0"
            >
              <UIcon name="i-mdi-paw" class="size-7 sm:size-8" />
            </span>
            <h3 class="hero-title text-xl sm:text-3xl text-accent">
              Para seu Animal
            </h3>
          </div>
          <p class="mt-4 text-sm sm:text-base text-primary/70 dark:text-gray-300 leading-relaxed">
            Teleconsulta veterinária, orientação, acompanhamento e muito mais
            para todas as fases da vida do seu melhor amigo.
          </p>
          <UButton
            :to="clientPortalTarget"
            size="lg"
            color="primary"
            class="mt-6 self-start font-semibold px-6 dark:bg-accent! dark:text-white! dark:hover:bg-accent/85!"
            trailing-icon="i-heroicons-arrow-right"
          >
            Ir para o Portal do Cliente
          </UButton>
        </div>

        <!-- PARA VOCÊ -->
        <div
          id="card-voce"
          class="reveal rounded-3xl border border-green-600/20 bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          style="animation-delay: 90ms"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <span
              class="flex items-center justify-center size-14 sm:size-16 rounded-full bg-green-600/10 text-green-600 shrink-0"
            >
              <UIcon name="i-heroicons-user" class="size-7 sm:size-8" />
            </span>
            <h3
              class="hero-title text-xl sm:text-3xl text-green-700 dark:text-green-500"
            >
              Para Você
            </h3>
          </div>
          <p class="mt-4 text-sm sm:text-base text-primary/70 dark:text-gray-300 leading-relaxed">
            Consultas médicas online, especialistas, exames, saúde mental e
            programas de prevenção para você e sua família.
          </p>
          <UButton
            :to="clientPortalTarget"
            size="lg"
            color="success"
            class="mt-6 self-start font-semibold px-6"
            trailing-icon="i-heroicons-arrow-right"
          >
            Ir para o Portal do Cliente
          </UButton>
        </div>
      </div>
    </section>

    <!-- SERVIÇOS / TÓPICOS -->
    <section class="pt-12 sm:pt-20">
      <div class="reveal text-center max-w-2xl mx-auto">
        <h2
          class="hero-title text-2xl sm:text-4xl lg:text-5xl text-primary dark:text-white"
        >
          O que você encontra
        </h2>
        <p class="mt-3 text-body-muted text-sm sm:text-lg">
          Documentos, orientação e acompanhamento com médicos qualificados,
          onde você estiver.
        </p>
      </div>

      <div class="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(service, i) in services"
          :key="service.title"
          class="reveal group flex items-start gap-4 rounded-3xl border border-accent/15 dark:border-white/10 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md"
          :style="{ animationDelay: `${(i % 3) * 80}ms` }"
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
    <section class="pt-12 sm:pt-20">
      <div class="reveal text-center max-w-2xl mx-auto">
        <h2
          class="hero-title text-2xl sm:text-4xl lg:text-5xl text-primary dark:text-white"
        >
          Como funciona
        </h2>
        <p class="mt-3 text-body-muted text-sm sm:text-lg">
          Do cadastro à consulta, em poucos minutos, para o seu animal e para você.
        </p>
      </div>

      <div class="mt-8 sm:mt-12 grid md:grid-cols-3 gap-6">
        <div
          v-for="(step, i) in howItWorks"
          :key="step.title"
          class="reveal relative rounded-3xl border border-accent/15 dark:border-white/10 bg-white dark:bg-gray-800 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          :style="{ animationDelay: `${i * 100}ms` }"
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

    <div class="reveal h-full pt-12 sm:pt-20">
      <!-- BENEFITS AND WHATSAPP BANNER -->
      <section>
        <StoreAdvantages />
      </section>
    </div>

    <!-- PRICES -->
    <div ref="pricingSection" id="pricingSection" class="reveal pt-12 sm:pt-20">
      <PrincingSection />
    </div>

    <!-- VIDEOAULAS CAROUSEL -->
    <div class="reveal pt-12 sm:pt-20">
      <VideoLessonsCarousel />
    </div>

    <!-- FAQ -->
    <section class="pt-12 sm:pt-20">
      <div class="reveal text-center max-w-2xl mx-auto">
        <h2
          class="hero-title text-2xl sm:text-4xl lg:text-5xl text-primary dark:text-white"
        >
          Perguntas frequentes
        </h2>
      </div>

      <div class="mt-10 max-w-5xl mx-auto flex flex-col gap-3">
        <details
          v-for="(item, i) in faqItems"
          :key="item.q"
          class="reveal group rounded-2xl border border-accent/15 dark:border-white/10 bg-white dark:bg-gray-800 px-5 sm:px-6 shadow-sm"
          :style="{ animationDelay: `${i * 60}ms` }"
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

  </div>
</template>

<style scoped>
.hero-title {
  font-family: "Recoleta", "DM Serif Display", Georgia, serif;
  font-weight: 600;
}

/* Animação de entrada ao rolar a página.
   Usa animation (não transition) para o stagger não interferir no hover dos cards. */
.reveal {
  opacity: 0;
}
.reveal-visible {
  animation: reveal-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
  }
  .reveal-visible {
    animation: none;
  }
}
</style>
