<script setup>
const route = useRoute();
const { t } = useI18n();

definePageParams({
  title: t("conserves"),
  backUrl: `/blog-${route.params.blogId}`,
});
</script>

<template>conserves</template>
