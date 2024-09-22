<script setup>
const props = defineProps([
  "blogId",
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
    // TODO: взависимости от типа нужно подбирать конфиг по умолчанию
    // default: BLOG_DEFAULT_YAML_CONFIG,
    default: "{}",
  },
  // TODO: select type
  blogId: { type: "hidden", default: props.blogId },
  id: { type: "hidden", default: props.loaded?.id },
});

onMounted(async () => {
  if (props.loaded)
    form$.value.load({
      ...props.loaded,
      // TODO: сохранять в обычный JSON но при вводе использовать преобразование в yaml
      // cfg: props.loaded.cfg && JSON.parse(props.loaded.cfg).yaml,
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.cfg = JSON.stringify({ yaml: form$.data.cfg });

  return formSubmitHelper("/auth/social-media")(FormData, form$);
};
</script>

<template>
  <div>
    <Vueform :endpoint="prepareData" :method="props.method" ref="form$" :schema="schema"
      @success="props.handleSuccess" />
  </div>
</template>
