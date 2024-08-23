<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status, error } = await useApiBlog(route.params.blogId);

definePageParams({
  title: data.name,
});
</script>

<template>
  <AppContentTypeMenu :blog="data" />
</template>
