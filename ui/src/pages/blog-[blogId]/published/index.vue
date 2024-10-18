<script setup>
const route = useRoute();
const { t } = useI18n();

definePageParams({
  title: t("alreadyPublished"),
  backUrl: `/blog/${route.params.blogId}`,
});
</script>

<template>alreadyPublished</template>
