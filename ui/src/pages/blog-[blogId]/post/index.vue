<script setup>
const route = useRoute();
const { t } = useI18n();

const postData = useLocalStateGet(LOCAL_STATES.newPost);
// const me = await useApiMe();
const postFormModel = ref(null);
const postFormRef = ref(null);

definePageParams({
  title: t("postData"),
  backUrl: `/blog-${route.params.blogId}`,
});

const handlePostSave = () => {
  useLocalStateSet(LOCAL_STATES.newPost, postFormRef.value.collectData());
  navigateTo(`/blog-${route.params.blogId}/post/select-sm`);
};
const handleToConserves = async () => {
  const res = await useApiCreatePost(postFormRef.value.collectData());

  console.log(1111, res);
};
</script>

<template>
  <FormPost
    v-model="postFormModel"
    ref="postFormRef"
    :preLoadedData="postData"
    :postType="POST_TYPES.post"
  />

  <div class="mt-4 flex gap-x-2">
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
