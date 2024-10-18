<script setup>
const props = defineProps([
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
  cfg: {
    type: "object",
    label: t("config"),
    schema: {
      authorName: { type: "text", label: t("authorName") },
    },
  },
  id: { type: "hidden", default: props.preLoadedData?.id },
});

onMounted(async () => {
  if (props.preLoadedData) form$.value.load(props.preLoadedData);
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  // form$.data.cfg = JSON.stringify(parseYaml(form$.data.cfg)) || "";
  form$.data.cfg = JSON.stringify(form$.data.cfg);

  return formSubmitHelper("/auth/users/me")(FormData, form$);
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
