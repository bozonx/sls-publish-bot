<script setup>
const props = defineProps(["modelValue", "loaded", "userId", "method"]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
const schema = ref({
  name: { type: "text", label: t("name") },
  cfg_yaml: { type: "hidden", default: "" },
  // TODO:  better to use prepare
  createdByUserId: { type: "hidden", default: props.userId },
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
    <!-- <div class="mb-8">Update your information.</div> -->

    <Vueform :endpoint="formSubmitHelper('/workspaces', `/workspaces/${loaded.id}`)" :method="props.method" ref="form$"
      :schema="schema" />
  </div>
</template>
