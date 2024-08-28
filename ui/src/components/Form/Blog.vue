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
  cfg: { type: "textarea", default: BLOG_DEFAULT_CONFIG },
  workspaceId: { type: "hidden", default: props.wpid },
  id: { type: "hidden", default: props.loaded?.id },
});

onMounted(async () => {
  if (props.loaded) form$.value.load(props.loaded);
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});
</script>

<template>
  <div>
    <Vueform :endpoint="formSubmitHelper('/auth/blogs')" :method="props.method" ref="form$" :schema="schema"
      @success="props.handleSuccess" />
  </div>
</template>
