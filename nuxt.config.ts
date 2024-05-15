// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    'nuxt-primevue'
  ],

  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
    },
  },

  primevue: {
    usePrimeVue: true,
    components: {
      include: '*',
    },
    directives: {
      include: '*',
    },
    composables: {
      include: '*',
    },
  },

  css: [
    'primevue/resources/themes/mira/theme.css',
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
  ],
})
