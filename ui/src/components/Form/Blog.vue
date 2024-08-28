<script setup>
const props = defineProps([
  "wpid",
  "modelValue",
  "loaded",
  "userId",
  "method",
  "handleSuccess",
]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
const schema = ref({
  name: { type: "text", label: t("name") },
  cfg: {
    type: "textarea",
    default: BLOG_DEFAULT_YAML_CONFIG,
  },
  workspaceId: { type: "hidden", default: props.wpid },
  id: { type: "hidden", default: props.loaded?.id },
});

onMounted(async () => {
  if (props.loaded)
    form$.value.load({
      ...props.loaded,
      cfg: props.loaded.cfg && JSON.parse(props.loaded.cfg).yaml,
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.cfg = JSON.stringify({ yaml: form$.data.cfg });

  return formSubmitHelper("/auth/blogs")(FormData, form$);
};
</script>

<template>
  <div>
    <Vueform :endpoint="prepareData" :method="props.method" ref="form$" :schema="schema"
      @success="props.handleSuccess" />
  </div>
</template>
