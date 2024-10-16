<script setup>
const route = useRoute();
const { t } = useI18n();

const { data: blog, status } = await useApiGetMyBlog(route.params.blogId);
const { data: sns, status: snsStatus } = await useApiListMySns(
  route.params.blogId,
);
// const postFormModel = ref(null);
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
  backUrl: `/blog/${route.params.blogId}/post`,
});

const handleTgPublish = () => {
  // snFormModel.value?.submit();

  // TODO: check validity

  console.log(111);
  // navigateTo(`/ blog / ${ route.params.blogId } / sn - ${ id }`);
};
</script>

<template>
  <div v-for="sm in allSmSupportedPosts">
    <div v-if="sm.type === SOCIAL_MEDIAS.telegram">
      <div class="mt-4">
        <SmartButton :label="$t('publish')" @click="handleTgPublish" />
      </div>
    </div>
  </div>
  <!-- <FormPost v-model="postFormModel" :blogId="route.params.blogId" /> -->
</template>
