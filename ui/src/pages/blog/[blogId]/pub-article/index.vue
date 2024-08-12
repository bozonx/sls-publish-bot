<script setup>
const route = useRoute();
const { t } = useI18n();
const blogConf = getBlogConf(route.params.blogId);

definePageParams({
  categoryTitle: blogConf.label,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("contentSelect"),
});
</script>

<template>
  <ArticleSelectContent :blogId="route.params.blogId" :nextStepUrl="`${route.path}/customize`" />
</template>
