<script setup>
const props = defineProps([
  "wpid",
  "modelValue",
  "preLoadedData",
  "method",
  "handleSuccess",
]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
// const schema = ref({
//   name: { type: "text", label: t("name") },
//   descr: {
//     type: "textarea",
//     label: t("description"),
//   },
//   cfg: {
//     type: "textarea",
//     label: t("config"),
//     default: "",
//   },
//   id: { type: "hidden", default: props.preLoadedData?.id },
//   workspaceId: { type: "hidden", default: props.wpid },
// });

onMounted(async () => {
  if (props.preLoadedData)
    form$.value.load({
      ...props.preLoadedData,
      cfg: stringifyYaml(props.preLoadedData.cfg),
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.cfg = JSON.stringify(parseYaml(form$.data.cfg)) || "";
  form$.data.tags = form$.data.tags.join(",");

  return formSubmitHelper("/auth/blogs")(FormData, form$);
};
</script>

<template>
  <Vueform
    :endpoint="prepareData"
    :method="props.method"
    ref="form$"
    @success="props.handleSuccess"
  >
    <TextElement name="name" :label="$t('name')" />
    <TextareaElement name="descr" :label="$t('description')" />
    <TextareaElement name="cfg" :label="$t('config')" />
    <FieldTagsElement name="tags" :label="$t('tags')" />

    <HiddenElement name="id" :default="props.preLoadedData?.id" />
    <HiddenElement name="workspaceId" :default="props.wpid" />
  </Vueform>
</template>
