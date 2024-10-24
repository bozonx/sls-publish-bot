<script setup>
const props = defineProps([
  "modelValue",
  "preLoadedData",
  "method",
  "handleSuccess",
  // for creating
  "socialMediaId",
  "postType",
]);
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const { data: blog } = await useApiGetBlog(route.params.blogId);

const form$ = ref(null);
const paramsFormModel = ref(null);
const nameDirty = ref(false);
const postTypes = Object.keys(POST_TYPES).map((i) => ({
  label: t(`postType.` + i),
  value: i,
}));
const templates = blog.value.cfg.templates?.[props.postType]?.map((i) => ({
  label: i[0],
  value: i[1].replace(/\\n/g, "\n"),
}));

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

const handleTmplSelect = (template) => {
  form$.value.update(template, "textGroup.textMd");
};

const handleNameInput = (event) => {
  nameDirty.value = !!event.target.value;
};

const handleTextMdChange = (value) => {
  if (nameDirty.value) return;

  form$.value.update(generatePostName(value, POST_NAME_LENGTH), "name");
};

const handleInputClear = () => {
  // form$.value.elements$.name.clear();
  form$.value.update(
    generatePostName(form$.value.data.textMd, POST_NAME_LENGTH),
    "name",
  );

  nameDirty.value = false;
};
</script>

<template>
  <Vueform
    :endpoint="prepareData"
    :method="props.method"
    ref="form$"
    @success="props.handleSuccess"
  >
    <SelectElement
      name="type"
      :label="$t('postType')"
      :items="postTypes"
      :default="props.postType"
      :disabled="!!props.postType"
    />

    <TextElement name="name" :label="$t('name')" @input="handleNameInput">
      <template #addon-after>
        <div @click.prevent="handleInputClear">X</div>
      </template>
    </TextElement>

    <TextareaElement name="descr" :label="$t('description')" />

    <GroupElement name="textGroup">
      <div>{{ $t("postTemplate") }}</div>
      <div>
        <ButtonElement
          v-for="(item, index) in templates"
          :name="'addTmpl' + index"
          :button-label="item.label"
          :submit="false"
          @click="handleTmplSelect(item.value)"
        />
      </div>
      <TextareaElement
        name="textMd"
        :label="$t('textMd')"
        @change="handleTextMdChange"
      />

      <FieldTextAnalitics :text="form$?.data.textMd" />
    </GroupElement>

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
