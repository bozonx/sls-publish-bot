import Aura from "@primevue/themes/aura";
// import Lara from "@primevue/themes/lara";
// import Nora from "@primevue/themes/nora";
import { definePreset } from "@primevue/themes";

// const MyPreset = definePreset(Aura, {
//   //Your customizations, see the following sections for examples
// });

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: "./src",
  // buildDir: 'nuxt-build'
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      devTgUserId: process.env.DEV_TG_USER_ID,
    },
  },
  $production: {},
  $development: {},
  app: {
    head: {
      script: [
        // { src: 'https://awesome-lib.js' }
      ],
    },
  },
  css: ["~/styles.css"],
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "dayjs-nuxt",
    "nuxt-snackbar",
    "@vueuse/nuxt",
    "@vueform/nuxt",
    "@primevue/nuxt-module",
    "nuxt-lodash",
  ],
  i18n: {
    vueI18n: "./i18n.config.js",
  },
  colorMode: {
    classSuffix: "",
  },
  primevue: {
    options: {
      theme: {
        // preset: MyPreset,
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: ".dark",
          cssLayer: false,
        },
      },
    },
  },
});
