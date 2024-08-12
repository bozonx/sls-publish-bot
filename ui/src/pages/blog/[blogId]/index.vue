<script setup>
const route = useRoute();
const { t } = useI18n();
const userConfig = useState("userConfig");

const blogConf = userConfig.value.blogs.find(
  (item) => item.id === route.params.blogId,
);

definePageParams({
  title: blogConf.label,
});
</script>

<template>
  <AppContentTypeMenu :blogId="route.params.blogId" />
</template>
