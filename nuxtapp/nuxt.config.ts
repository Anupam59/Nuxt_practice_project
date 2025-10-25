import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/input.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: "2025-02-28",
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8000/api',
      urlBase: 'http://127.0.0.1:8000',
    },
  },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  pinia: {
    storesDirs: ['./stores'],
  },
});