<script setup>
const props = defineProps(["modelValue", "loaded", "wpid", "method"]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
const schema = ref({
  name: { type: "text", label: t("name") },
  cfg_yaml: { type: "textarea", default: "socialMedia: []" },
  workspaceId: { type: "hidden", default: props.wpid },
  // TODO: add user id
  createdByUserId: { type: "hidden", default: 1 },
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

    <Vueform :endpoint="formSubmitHelper('/blogs', `/blogs/${loaded.id}`)" :method="props.method" ref="form$"
      :schema="schema" />
  </div>
</template>
