import en from "@vueform/vueform/locales/en";
import ru from "@vueform/vueform/locales/ru";
import tailwind from "@vueform/vueform/dist/tailwind";
import { defineConfig } from "@vueform/vueform";

export default defineConfig({
  theme: tailwind,
  locales: { en, ru },
  locale: "en",
});
