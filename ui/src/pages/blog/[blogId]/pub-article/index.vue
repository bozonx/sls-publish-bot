<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status, error } = await useApiBlog(route.params.blogId);
const blogConf = getBlogConf(data.value);

definePageParams({
  categoryTitle: data.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("contentSelect"),
});
</script>

<template>
  <ArticleSelectContent :blogConf="blogConf" :nextStepUrl="`${route.path}/customize`" />
</template>
