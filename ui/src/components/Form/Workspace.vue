<script setup>
const props = defineProps([
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
  cfg_yaml: { type: "hidden", default: "" },
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
    <Vueform :endpoint="formSubmitHelper('/workspaces')" :method="props.method" ref="form$" :schema="schema"
      @success="props.handleSuccess" />
  </div>
</template>
