<script setup>
const { t } = useI18n();

definePageParams({
  title: t("inbox"),
});
</script>
<template>
  <AppInboxManage />
</template>
