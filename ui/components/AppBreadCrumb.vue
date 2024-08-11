<script setup>
const props = defineProps(["items"]);
const { t } = useI18n();
const home = {
  label: t("home"),
  to: "/",
};
</script>

<template>
  <Breadcrumb :home="home" :model="items" class="mb-4">
    <template #item="{ item }">
      <NuxtLink v-if="item.to" :href="item.to">
        {{ item.label }}
      </NuxtLink>
      <span v-else>{{ item.label }}</span>
    </template>
    <template #separator> / </template>
  </Breadcrumb>
</template>
