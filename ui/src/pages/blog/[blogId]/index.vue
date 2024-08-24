<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status } = await useApiGetBlog(route.params.blogId);

definePageParams({
  title: data.value.name,
});
</script>

<template>
  <AppContentTypeMenu :blog="data" :status="status" />
</template>
