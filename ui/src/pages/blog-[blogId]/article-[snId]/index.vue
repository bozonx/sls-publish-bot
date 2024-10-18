<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status } = await useApiGetMyBlog(route.params.blogId);
const { data: sn, status: snStatus } = await useApiGetMySn(route.params.snId);
const snCfg = JSON.parse(sn.value.cfg);

definePageParams({
  categoryTitle: data.value.name,
  categoryUrl: `/blog-${route.params.blogId}`,
  title: t("contentSelect"),
});
</script>

<template>
  <ArticleSelectContent :snCfg="snCfg" :nextStepUrl="`${route.path}/customize`" />
</template>
