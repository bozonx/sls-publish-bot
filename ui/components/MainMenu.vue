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
  <Menu :model="items" class="w-full md:w-60">
    <template #item="{ item }">
      <SmartButton :item="item" />
    </template>
  </Menu>
</template>
