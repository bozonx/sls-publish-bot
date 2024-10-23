<script setup>
const props = defineProps([
  "modelValue",
  "preLoadedData",
  "method",
  "handleSuccess",
  // for creating
  "socialMediaId",
]);
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const { data: blog } = await useApiGetBlog(route.params.blogId);

const form$ = ref(null);
const paramsFormModel = ref(null);

onMounted(async () => {
  if (props.preLoadedData)
    form$.value.load({
      ...props.preLoadedData,
      payload: props.preLoadedData.payload
        ? JSON.parse(props.preLoadedData.payload)
        : {},
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.payload = JSON.stringify(paramsFormModel.value.data);
  form$.data.socialMediaId = props.socialMediaId;

  return formSubmitHelper("/auth/posts")(FormData, form$);
};

const generateName = () => {
  // TODO: generate name
};
</script>

<template>
  <Vueform
    :endpoint="prepareData"
    :method="props.method"
    ref="form$"
    @success="props.handleSuccess"
  >
    <div class="flex gap-x-2 col-span-12 w-full">
      <div class="flex-1">
        <TextElement name="name" :label="$t('name')" />
      </div>
      <div class="flex items-end">
        <SmartButton :label="$t('generate')" @click.prevent="generateName" />
      </div>
    </div>
    <TextareaElement name="descr" :label="$t('description')" />
    <TextareaElement name="text" :label="$t('textMd')" />

    <FieldAuthorElement name="author" :label="$t('postAuthor')" />
    <!-- <GroupElement name="authorGroup" :before="$t('postAuthor')"> -->
    <!--   <FieldAuthor /> -->
    <!-- </GroupElement> -->

    <GroupElement name="dateGroup" :before="$t('publicationDate')">
      <FieldDate :blog="blog" />
      <FieldTime :blog="blog" />
    </GroupElement>

    <ObjectElement name="payload">
      <FieldTagsElement name="tags" :label="$t('tags')" />
    </ObjectElement>
  </Vueform>
</template>
