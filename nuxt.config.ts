// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3001/api',
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  ui: {
    colorMode: false,
  },
  icon: {
    localApiEndpoint: "/_icons",
    serverBundle: {
      collections: ["heroicons", "mdi", "ph"],
    },
  },
  app: {
    head: {
      title: "ConectaVet - Telemedicina Veterinária",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },

  devServer: {
    host: "[IP_ADDRESS]",
  },
});
