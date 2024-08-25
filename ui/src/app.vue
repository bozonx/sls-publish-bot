<script setup>
// from app.config.js
// const appConfig = useAppConfig();

// await callOnce(async () => {
//   userConfig.value = parseYaml(defaultUserConfig);
// });
if (isInsideTgBot()) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}
</script>

<template>
  <NuxtLoadingIndicator />
  <LayoutTopBar />
  <div class="mt-6">
    <NuxtPage />
  </div>
</template>
