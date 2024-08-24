<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status, error } = await useApiGetBlog(route.params.blogId);
const blogConf = getItemConf(data.value);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/pub-article`,
  categoryTitle: data.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("pubCustomize"),
});
</script>

<template>
  <ArticleCustomize :blogConf="blogConf" :currentPath="route.path" />
</template>
