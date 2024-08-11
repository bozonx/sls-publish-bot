<script setup>
import { parseYaml } from "./lib/helpers.js";
import defaultUserConfig from "./lib/defaultUserConfig.js";
const userConfig = useState("userConfig");

await callOnce(async () => {
  userConfig.value = parseYaml(defaultUserConfig);
  // websiteConfig.value = await $fetch("https://my-cms.com/api/website-config");
});
</script>

<template>
  <TopBar />
  <div class="mt-6">
    <NuxtPage />
  </div>
</template>
