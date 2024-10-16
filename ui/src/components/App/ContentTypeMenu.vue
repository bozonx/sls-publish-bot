<script setup>
const props = defineProps(["blog", "status"]);
// const route = useRoute();
const { t } = useI18n();
// const blogConf = JSON.parse(props.blog);
const { data: sns, status: snsStatus } = await useApiListMySns(props.blog.id);

// const allTypes = {};

// for (const sm of blogConf.yaml.socialMedia) {
//   const smTypes = resolveSmTypes(sm);
//
//   for (const item of smTypes) allTypes[item] = true;
// }

// const items = Object.keys(allTypes).map((postType) => ({
//   label: t(`postType.${postType}`),
//   to: `/blog/${props.blog.id}/pub-${postType}`,
// }));

const items = [];

const allBlogsSn = sns.value.filter((i) => i.type === SOCIAL_MEDIAS.blog);

// TODO: только в случае если есть ещё хотябы дзен или телеграм
for (const sn of allBlogsSn) {
  items.push({
    // TODO: только для дзена ???
    label: `${t("postType.article")} ${makeSnName(sn)}`,
    to: `/blog/${props.blog.id}/article-${sn.id}`,
  });
}

const allSmSupportedPosts = sns.value.filter((i) =>
  [
    // SOCIAL_MEDIAS.dzen,
    SOCIAL_MEDIAS.telegram,
    SOCIAL_MEDIAS.youtube,
    SOCIAL_MEDIAS.odysee,
  ].includes(i.type),
);

// for (const sn of allSnSupportedPosts) {
//   items.push({
//     label: `${t("postType.post")} ${makeSnName(sn)}`,
//     to: `/blog/${props.blog.id}/post-${sn.id}`,
//   });
// }
if (allSmSupportedPosts.length) {
  items.push({
    label: t("postType.post"),
    to: `/blog/${props.blog.id}/post`,
  });
}

const allSmSupportedMicroPosts = sns.value.filter((i) =>
  [SOCIAL_MEDIAS.mastadon, SOCIAL_MEDIAS.threads, SOCIAL_MEDIAS.x].includes(
    i.type,
  ),
);

if (allSmSupportedMicroPosts.length) {
  items.push({
    label: t("postType.microPost"),
    to: `/blog/${props.blog.id}/micropost`,
  });
}
</script>

<template>
  <SmartMenu :items="items" />
</template>
