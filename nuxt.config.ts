// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  sourcemap: {
    client: false,
    server: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:3001/api",
      maffyStoreUrl: process.env.NUXT_PUBLIC_MAFFY_STORE_URL ?? "https://maffy.com.br",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/icon"],
  ui: {
    colorMode: false,
  },
  icon: {
    collections: ["heroicons", "mdi", "ph"],
    localApiEndpoint: "/_icons",
    serverBundle: {
      collections: ["heroicons", "mdi", "ph"],
    },
  },
  app: {
    head: {
      title: "ConectaVidas",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  routeRules: {
    "/backoffice": {
      redirect: { to: "/painel/adm", statusCode: 301 },
    },
    "/backoffice/**": {
      redirect: { to: "/painel/adm/**", statusCode: 301 },
    },
    "/veterinario": {
      redirect: { to: "/painel/veterinario/consultas", statusCode: 301 },
    },
    "/veterinario/**": {
      redirect: { to: "/painel/veterinario/**", statusCode: 301 },
    },
    "/meu-pet": {
      redirect: { to: "/painel/cliente/pets", statusCode: 301 },
    },
    "/painel/cliente/marketplace": {
      redirect: { to: "/maffy-store", statusCode: 301 },
    },
  },
  vite: {
    css: {
      devSourcemap: false,
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        onwarn(warning, warn) {
          const message = warning.message ?? "";
          if (
            warning.code === "SOURCEMAP_ERROR" ||
            message.includes("Sourcemap is likely to be incorrect") ||
            message.includes("contains an annotation that Rollup cannot interpret")
          ) {
            return;
          }

          warn(warning);
        },
      },
    },
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "maska/vue",
        "@iconify-json/mdi",
        "@iconify-json/heroicons",
        "@iconify-json/ph",
      ],
    },
  },

  devServer: {
    host: "127.0.0.1",
  },
});
