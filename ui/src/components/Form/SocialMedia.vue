<script setup>
const props = defineProps([
  // it is for create
  "blogId",
  "modelValue",
  "preLoadedData",
  "method",
  "handleSuccess",
]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
const schema = ref({
  name: { type: "text", label: t("name") },
  type: {
    type: "select",
    label: t("snType"),
    items: Object.keys(SOCIAL_MEDIAS),
  },
  cfg: {
    type: "textarea",
    label: t("config"),
    // TODO: взависимости от типа нужно подбирать конфиг по умолчанию
    // default: BLOG_DEFAULT_YAML_CONFIG,
    default: "",
  },
  id: { type: "hidden", default: props.preLoadedData?.id },
  blogId: { type: "hidden", default: props.blogId },
});

onMounted(async () => {
  if (props.preLoadedData)
    form$.value.load({
      ...props.preLoadedData,
      cfg:
        props.preLoadedData.cfg &&
        stringifyYaml(JSON.parse(props.preLoadedData.cfg)),
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.cfg = JSON.stringify(parseYaml(form$.data.cfg)) || "";

  return formSubmitHelper("/auth/social-media")(FormData, form$);
};
</script>

<template>
  <Vueform :endpoint="prepareData" :method="props.method" ref="form$" :schema="schema" @success="props.handleSuccess" />
</template>
