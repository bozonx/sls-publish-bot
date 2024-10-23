// import axios from "axios";
import en from "@vueform/vueform/locales/en";
import ru from "@vueform/vueform/locales/ru";
import tailwind from "@vueform/vueform/dist/tailwind";
import { defineConfig } from "@vueform/vueform";
// import PubTagsElement from "./src/components/Field/PubTagsElement.vue";
import FieldTagsElement from "./src/components/Field/TagsElement.vue";

// const runtimeConfig = useRuntimeConfig();
//
// axios.defaults.headers.post = {
//   "Content-Type": "application/json",
// };
//
export default defineConfig({
  // axios,
  theme: tailwind,
  locales: { en, ru },
  locale: "en",
  elements: [FieldTagsElement],
  // endpoints: {
  //   submit: {
  //     url: runtimeConfig.public.apiBaseUrl,
  //     method: "post",
  //   },
  // },
});
