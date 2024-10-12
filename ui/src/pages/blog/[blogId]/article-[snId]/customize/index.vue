<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status } = await useApiGetMyBlog(route.params.blogId);
const { data: sns, status: snsStatus } = await useApiListMySns(
  route.params.blogId,
);

definePageParams({
  backUrl: `/blog/${route.params.blogId}/article-${route.params.snId}`,
  categoryTitle: data.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("pubCustomize"),
});
</script>

<template>
  <ArticleCustomize :sns="sns" :currentPath="route.path" />
</template>
