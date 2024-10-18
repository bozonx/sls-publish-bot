<script setup>
const route = useRoute();
const { t } = useI18n();

const { data: blog, status } = await useApiGetMyBlog(route.params.blogId);
const { data: sns, status: snsStatus } = await useApiListMySns(
  route.params.blogId,
);
const postData = useLocalStateGet(LOCAL_STATES.newPost);
const allSmSupportedPosts = sns.value.filter((i) =>
  [
    // SOCIAL_MEDIAS.dzen,
    SOCIAL_MEDIAS.telegram,
    SOCIAL_MEDIAS.youtube,
    SOCIAL_MEDIAS.odysee,
  ].includes(i.type),
);

definePageParams({
  categoryTitle: blog.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("selectPubSns"),
  backUrl: `/blog-${route.params.blogId}/post`,
});
</script>

<template>
  <AppPostPreview postData="postData" />

  <AppPostDetails postData="postData" />

  <div v-for="sm in allSmSupportedPosts">
    <Fieldset
      v-if="sm.type === SOCIAL_MEDIAS.telegram"
      :legend="$t('socialMedia.telegram')"
    >
      <AppTelegramPubSetup postData="postData" />
    </Fieldset>
  </div>
</template>
