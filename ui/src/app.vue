<script setup>
// from app.config.js
// const appConfig = useAppConfig();

// await callOnce(async () => {
//   userConfig.value = parseYaml(defaultUserConfig);
// });
window.Telegram?.WebApp.ready();
</script>

<template>
  <NuxtLoadingIndicator />
  <LayoutTopBar />
  <div class="mt-6">
    <NuxtPage />
  </div>
</template>
