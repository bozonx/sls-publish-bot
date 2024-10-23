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
// const schema = ref({
//   name: { type: "text", label: t("name") },
//   descr: {
//     type: "textarea",
//     label: t("description"),
//   },
//   type: {
//     type: "select",
//     label: t("snType"),
//     items: Object.keys(SOCIAL_MEDIAS),
//   },
//   cfg: {
//     type: "object",
//     label: t("config"),
//     schema: {
//       // TODO: взависимости от типа нужно подбирать конфиг по умолчанию
//       postGitPath: { type: "text", label: t("postGitPath") },
//     },
//   },
//   id: { type: "hidden", default: props.preLoadedData?.id },
//   blogId: { type: "hidden", default: props.blogId },
// });

onMounted(async () => {
  // if (props.preLoadedData) form$.value.load(props.preLoadedData);
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
  // form$.data.cfg = JSON.stringify(form$.data.cfg) || "";
  form$.data.tags = form$.data.tags.join(",");

  return formSubmitHelper("/auth/social-media")(FormData, form$);
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
    <SelectElement
      name="type"
      :label="$t('snType')"
      :items="Object.keys(SOCIAL_MEDIAS)"
    />
    <TextareaElement name="cfg" :label="$t('config')" />
    <FieldTagsElement name="tags" :label="$t('tags')" />

    <HiddenElement name="id" :default="props.preLoadedData?.id" />
    <HiddenElement name="blogId" :default="props.blogId" />
  </Vueform>
</template>
