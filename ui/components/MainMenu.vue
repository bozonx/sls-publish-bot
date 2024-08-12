<script setup>
const { t } = useI18n();

const items = [
  {
    label: t("inbox"),
    icon: "home",
    to: "/inbox",
  },
  {
    label: t("settings"),
    icon: "home",
    to: "/settings",
  },
];
</script>
<template>
  <SmartMenu :items="items" />
</template>
