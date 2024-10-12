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

for (const blogSn of allBlogsSn) {
  items.push({
    // TODO: add name of sn
    label: t(`postType.article`),
    to: `/blog/${props.blog.id}/article-${blogSn.id}`,
  });
}
</script>

<template>
  <SmartMenu :items="items" />
</template>
