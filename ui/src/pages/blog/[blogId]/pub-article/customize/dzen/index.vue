<script setup>
const route = useRoute();
const { t } = useI18n();
const blogConf = getBlogConf(route.params.blogId);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/pub-article/customize`,
  categoryTitle: blogConf.label,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("copyToDzen"),
});
</script>
<template>
  <ArticleDzenCopy :blogId="route.params.blogId" />
</template>
