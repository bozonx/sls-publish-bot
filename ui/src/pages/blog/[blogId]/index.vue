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
  },
];
</script>
<template>
  <AppBreadCrumb :items="breadCrumbs" />

  <ContentTypeMenu :blogId="route.params.blogId" />
</template>
