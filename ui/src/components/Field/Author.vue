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

const handleCustomAuthorChange = (value) => {
  authorRef.value.value = value;
};
</script>

<template>
  <TextElement
    name="author"
    ref="authorRef"
    :disabled="true"
    :columns="{ container: 3 }"
  />
  <ButtonElement
    v-if="authorName"
    name="setAuthorName"
    secondary
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
    @change="handleCustomAuthorChange"
  />
  <CheckboxElement name="noAuthor" @change="handleNoAuthorChange">
    {{ t("noAuthor") }}
  </CheckboxElement>
</template>
