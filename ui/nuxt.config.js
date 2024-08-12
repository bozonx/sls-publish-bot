import Aura from "@primevue/themes/aura";
// import Lara from "@primevue/themes/lara";
// import Nora from "@primevue/themes/nora";
import { definePreset } from "@primevue/themes";

// const MyPreset = definePreset(Aura, {
//   //Your customizations, see the following sections for examples
// });

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  $production: {},
  $development: {},
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "dayjs-nuxt",
    "nuxt-snackbar",
    "@vueuse/nuxt",
    "@vueform/nuxt",
    "@primevue/nuxt-module",
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
