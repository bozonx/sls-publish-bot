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

const articleContent = ref(null);
const fetchError = ref(null);

await callOnce(async () => {
  // websiteConfig.value = await $fetch("https://my-cms.com/api/website-config");
});
</script>
<template>
  <ArticleCustomize :articleContent="articleContent" :fetchError="fetchError" :blogId="route.params.blogId"
    :nextStepUrl="`${route.path}/confirm`" />
</template>
