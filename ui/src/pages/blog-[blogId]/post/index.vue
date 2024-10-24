<script setup>
const route = useRoute();
const { t } = useI18n();

const postData = useLocalStateGet(LOCAL_STATES.newPost);
// const me = await useApiMe();
const postFormModel = ref(null);

definePageParams({
  title: t("postData"),
  backUrl: `/blog-${route.params.blogId}`,
});

const handlePostSave = () => {
  useLocalStateSet(LOCAL_STATES.newPost, postFormModel.value.data);

  navigateTo(`/blog-${route.params.blogId}/post/select-sm`);
};
const saveToConserves = () => {
  console.log(1111, postFormModel.value.data);
};
</script>

<template>
  <FormPost
    v-model="postFormModel"
    :preLoadedData="postData"
    :postType="POST_TYPES.post"
  />

  <div class="mt-4">
    <SmartButton
      :label="$t('next')"
      @click="handlePostSave"
      :disabled="postFormModel?.invalid"
    />
    <SmartButton
      :label="$t('saveToConserves')"
      @click="handleToConserves"
      :disabled="postFormModel?.invalid"
    />
  </div>
</template>
