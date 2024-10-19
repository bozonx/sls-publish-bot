<script setup>
const props = defineProps(["blog"]);
// const route = useRoute();
const { t } = useI18n();

const { data: tags } = await useApiListBlogTags(props.blog.id);

const form$ = ref(null);
// const textRef = ref(null);
const items = ref(tags.value.map((i) => i.name));

const handleSave = () => {
  const tags = [...form$.value.data.tags];
  console.log(222);
};

const handleAddTags = async () => {
  // TODO: parse tags

  const tags = form$.value.data.newTag;

  items.value.push(tags);

  form$.value.elements$.tags.select([tags]);
};
</script>

<template>
  <Vueform :endpoint="false" ref="form$">
    <TagsElement name="tags" :items="items" :readOnly="true" />
    <TextElement name="newTag" />
    <ButtonElement name="addTags" :submit="false" @click="handleAddTags" />
  </Vueform>

  <div class="mt-4">
    <SmartButton :label="$t('save')" @click="handleSave" />
  </div>
</template>
