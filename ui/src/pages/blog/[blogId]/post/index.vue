<script setup>
const route = useRoute();
const { t } = useI18n();

// const { data: blog, status } = await useApiGetMyBlog(route.params.blogId);
const postFormModel = ref(null);

definePageParams({
  // categoryTitle: blog.value.name,
  // categoryUrl: `/blog/${route.params.blogId}`,
  title: t("contentSelect"),
  backUrl: `/blog/${route.params.blogId}`,
});

const handlePostSave = () => {
  // snFormModel.value?.submit();

  // TODO: check validity

  console.log(111, postFormModel.value);
  // navigateTo(`/ blog / ${ route.params.blogId } / sn - ${ id }`);
};
</script>

<template>
  <FromPost v-model="postFormModel" :blogId="route.params.blogId" />

  <div>
    <SmartButton :label="$t('next')" @click="handlePostSave" />
  </div>
</template>
