<script setup>
const route = useRoute();
const { t } = useI18n();
const blogConf = getBlogConf(route.params.blogId);

definePageParams({
  title: blogConf.label,
});
</script>

<template>
  <AppContentTypeMenu :blogId="route.params.blogId" />
</template>
