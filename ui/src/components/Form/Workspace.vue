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
    type: "textarea",
    label: t("config"),
    default: "{}",
  },
  id: { type: "hidden", default: props.preLoadedData?.id },
});

onMounted(async () => {
  if (props.preLoadedData) form$.value.load(props.preLoadedData);
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});
</script>

<template>
  <Vueform :endpoint="formSubmitHelper('/auth/workspaces')" :method="props.method" ref="form$" :schema="schema"
    @success="props.handleSuccess" />
</template>
