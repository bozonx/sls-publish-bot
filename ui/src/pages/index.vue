<script setup>
const userConfig = useState("userConfig");
const { t } = useI18n();

definePageParams({
  showHome: false,
  title: t("appTitle"),
});
const { data, status } = await useApiListMyWorkspaces();
</script>

<template>
  <SimpleList :data="data" :status="status" class="mb-4">
    <template #item="{ item }">
      <AppWorkspaceItem :item="item" />
    </template>
  </SimpleList>

  <AppMainMenu />

  <NuxtLink to="/login">login</NuxtLink>
</template>
