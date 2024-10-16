<script setup>
const route = useRoute();
const { t } = useI18n();

// const { data: blog, status } = await useApiGetMyBlog(route.params.blogId);
const postFormModel = ref(null);

definePageParams({
  // categoryTitle: blog.value.name,
  // categoryUrl: `/blog/${route.params.blogId}`,
  title: t("postData"),
  backUrl: `/blog/${route.params.blogId}`,
});

const handlePostSave = () => {
  // snFormModel.value?.submit();

  // TODO: check validity
  // TODO: save to state

  console.log(111, postFormModel.value.data);

  navigateTo(`/blog/${route.params.blogId}/post/select-sm`);
};
</script>

<template>
  <FormPost v-model="postFormModel" :blogId="route.params.blogId" />

  <div class="mt-4">
    <SmartButton :label="$t('next')" @click="handlePostSave" />
  </div>
</template>
