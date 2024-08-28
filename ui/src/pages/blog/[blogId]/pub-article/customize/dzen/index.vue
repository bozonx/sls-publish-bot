<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status } = await useApiGetBlog(route.params.blogId);
const blogConf = getItemConf(data.value);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/pub-article/customize`,
  categoryTitle: data.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("copyToDzen"),
});
</script>

<template>
  <ArticleDzenCopy :blogConf="blogConf" />
</template>
