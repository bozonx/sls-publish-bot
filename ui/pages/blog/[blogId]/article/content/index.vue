<script setup>
const route = useRoute();
const { t } = useI18n();
const userConfig = useState("userConfig");

const blogConf = userConfig.value.blogs.find(
  (item) => item.id === route.params.blogId,
);
const breadCrumbs = [
  {
    label: blogConf?.label,
    to: `/blog/${route.params.blogId}`,
  },
  {
    label: t("postType.article"),
    to: `/blog/${route.params.blogId}/article`,
  },
  {
    label: t("contentSelect"),
  },
];
const sm = JSON.parse(route.query.sm);
</script>
<template>
  <AppBreadCrumb :items="breadCrumbs" />

  <div>{{ sm.map((item) => $t(`socialMedia.${item}`)).join(", ") }}</div>

  <SelectArticleContent :blogId="route.params.blogId"
    :nextStepUrl="`${route.path}/customize?sm=${encodeURIComponent(route.query.sm)}`" />
</template>
