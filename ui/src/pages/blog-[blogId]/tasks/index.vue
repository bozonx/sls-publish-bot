<script setup>
const route = useRoute();
const { t } = useI18n();

definePageParams({
  title: t("tasks"),
  backUrl: `/blog-${route.params.blogId}`,
});
</script>

<template>tasks</template>
