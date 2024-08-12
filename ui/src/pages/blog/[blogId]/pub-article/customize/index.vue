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

const postGitPath = blogConf.socialMedia.find(
  (item) => item.use === SOCIAL_MEDIAS.blog,
)?.postGitPath;
const articleContent = ref(null);
const fetchError = ref(null);

// await callOnce(async () => {
$fetch(`${postGitPath}/${route.query.article}.md`)
  .then((res) => {
    articleContent = res;
  })
  .catch((e) => {
    fetchError.value = true;
  });
// });
</script>

<template>
  <ArticleCustomize
    :articleContent="articleContent"
    :fetchError="fetchError"
    :blogId="route.params.blogId"
    :nextStepUrl="`${route.path}/confirm?article=${encodeURIComponent(route.query.article)}`"
  />
</template>
