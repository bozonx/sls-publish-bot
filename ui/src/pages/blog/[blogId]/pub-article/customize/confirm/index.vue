<script setup>
const route = useRoute();
const { t } = useI18n();
const blogConf = getBlogConf(route.params.blogId);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/pub-article/customize?article=${encodeURIComponent(route.query.article)}`,
  categoryTitle: blogConf.label,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("pubConfirm"),
});
</script>
<template>
  <ArticleConfirm :blogId="route.params.blogId" />
</template>
