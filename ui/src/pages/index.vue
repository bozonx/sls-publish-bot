<script setup>
const userConfig = useState("userConfig");
const { t } = useI18n();

definePageParams({
  showHome: false,
  title: t("appTitle"),
});

const { data, status } = await useWorkspacesList();
</script>

<template>
  <SimpleList :data="data" :status="status">
    <template #item="{ item }">
      <AppWorkspaceItem :item="item" />
    </template>
  </SimpleList>

  <AppMainMenu />
</template>
