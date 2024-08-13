<script setup>
const route = useRoute();
const { t } = useI18n();
const blogConf = getBlogConf(route.params.blogId);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/pub-article`,
  categoryTitle: blogConf.label,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("pubCustomize"),
});
</script>

<template>
  <ArticleCustomize :blogId="route.params.blogId" :currentPath="route.path" />
</template>
