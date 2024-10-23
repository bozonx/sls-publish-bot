<script setup>
const props = defineProps(["blog", "label"]);
// const route = useRoute();
const { t } = useI18n();

const form$ = ref(null);
// const textRef = ref(null);
const items = ref([]);

const handleSave = () => {
  const tags = [...form$.value.data.tags];
  console.log(222, tags);
};

const handleAddTags = async () => {
  const tags = parseTagsFromInput(form$.value.data.newTag);

  // TODO: здесь могут быть дубли
  tags.forEach((i) => items.value.push(i));

  form$.value.elements$.tags.select(tags);
};
</script>

<template>
  <!-- <Vueform :endpoint="false" ref="form$"> -->
  <TagsElement name="tags" :items="items" :readOnly="true" />
  <TextElement name="newTag" :placeholder="$t('writeNewTags')" />
  <ButtonElement name="addTags" :submit="false" @click="handleAddTags">{{
    $t("add")
  }}</ButtonElement>
  <!-- </Vueform> -->

  <!-- <div class="mt-4"> -->
  <!-- <SmartButton :label="$t('save')" @click="handleSave" /> -->
  <!-- </div> -->
</template>
