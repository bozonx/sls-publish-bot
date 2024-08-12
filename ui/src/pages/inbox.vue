<script setup>
const { t } = useI18n();
const breadCrumbs = [
  {
    label: t("inbox"),
  },
];
</script>
<template>
  <AppBreadCrumb :items="breadCrumbs" />
</template>
