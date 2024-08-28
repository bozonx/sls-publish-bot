<script setup>
// from app.config.js
// const appConfig = useAppConfig();

await callOnce(async () => {
  if (isInsideTgBot()) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
  // userConfig.value = parseYaml(defaultUserConfig);
});
</script>

<template>
  <NuxtLoadingIndicator />
  <LayoutTopBar class="px-4" />
  <div class="pt-2 pb-12 px-4">
    <NuxtPage />
  </div>
</template>
