<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status } = await useApiGetMyBlog(route.params.blogId);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/article-${route.params.snId}/customize`,
  categoryTitle: data.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("copyToDzen"),
});
</script>

<template>
  <ArticleDzenCopy />
</template>
