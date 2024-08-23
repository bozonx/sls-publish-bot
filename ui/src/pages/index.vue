<script setup>
const userConfig = useState("userConfig");
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

definePageParams({
  showHome: false,
  title: t("appTitle"),
});

const { data, status, error, refresh, clear } = await useApiList("workspaces");
</script>

<template>
  <AppWorkspacesBlogsList :status="status" :error="error" :data="data" />
  <AppMainMenu />
</template>
