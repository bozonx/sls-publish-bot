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
  descr: {
    type: "textarea",
    label: t("description"),
  },
  type: {
    type: "select",
    label: t("snType"),
    items: Object.keys(SOCIAL_MEDIAS),
  },
  cfg: {
    type: "object",
    label: t("config"),
    schema: {
      // TODO: взависимости от типа нужно подбирать конфиг по умолчанию
      postGitPath: { type: "text", label: t("postGitPath") },
    },
  },
  id: { type: "hidden", default: props.preLoadedData?.id },
  blogId: { type: "hidden", default: props.blogId },
});

onMounted(async () => {
  if (props.preLoadedData) form$.value.load(props.preLoadedData);
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.cfg = JSON.stringify(form$.data.cfg) || "";

  return formSubmitHelper("/auth/social-media")(FormData, form$);
};
</script>

<template>
  <Vueform
    :endpoint="prepareData"
    :method="props.method"
    ref="form$"
    :schema="schema"
    @success="props.handleSuccess"
  />
</template>
