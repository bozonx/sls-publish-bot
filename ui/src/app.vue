<script setup>
import { parseYaml } from "./lib/helpers.js";
import defaultUserConfig from "./lib/defaultUserConfig.js";
import "./styles.css";

const userConfig = useState("userConfig");
// from app.config.js
const appConfig = useAppConfig();

await callOnce(async () => {
  userConfig.value = parseYaml(defaultUserConfig);
});
</script>

<template>
  <TopBar />
  <div class="mt-6">
    <NuxtPage />
  </div>
</template>
