<script setup>
const props = defineProps(["modelValue", "preLoadedData", "handleSubmit"]);
const { t } = useI18n();

const { data: me } = await useApiMe();

const authorRef = ref(null);
const customAuthorRef = ref(null);
const noAuthor = ref(false);
const authorName = me.value.cfg.authorName;

const handleSetUserAuthor = () => {
  authorRef.value.value = authorName;
};

const handleNoAuthorChange = (isChecked) => {
  if (isChecked) {
    authorRef.value.value = null;
  }

  noAuthor.value = isChecked;
};

const handleCustomAuthorInput = (value) => {
  authorRef.value.value = customAuthorRef.value.value;
};
</script>

<template>
  <TextElement
    name="author"
    ref="authorRef"
    :default="authorName"
    :disabled="true"
    :columns="{ container: 4 }"
  />
  <ButtonElement
    v-if="authorName"
    name="setAuthorName"
    secondary
    :columns="{ container: 4 }"
    :submits="false"
    :button-label="t('setAuthor') + ': ' + authorName"
    :disabled="noAuthor || authorRef?.value === authorName"
    @click="handleSetUserAuthor"
  />
  <TextElement
    name="customAuthor"
    ref="customAuthorRef"
    :label="$t('customAuthor')"
    :disabled="noAuthor"
    @input="handleCustomAuthorInput"
  />
  <CheckboxElement name="noAuthor" @change="handleNoAuthorChange">
    {{ t("noAuthor") }}
  </CheckboxElement>
</template>
