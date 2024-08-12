<script setup>
const userConfig = useState("userConfig");
const { t } = useI18n();

definePageParams({
  showHome: false,
  title: t("appTitle"),
});
</script>

<template>
  <AppBlogsList :blogs="userConfig.blogs" class="mb-4" />
  <AppMainMenu />
</template>
