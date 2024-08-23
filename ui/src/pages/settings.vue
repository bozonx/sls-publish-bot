<script setup>
const { locale, setLocale } = useI18n();
const { t } = useI18n();
const colorMode = useColorMode();

const breadCrumbs = [
  {
    label: t("settings"),
  },
];
// console.log(colorMode.preference);
</script>

<template>
  <AppBreadCrumb :items="breadCrumbs" />

  <AppConfigureWorkspaces />

  <div>
    <button @click="setLocale('en')">en</button>
    <button @click="setLocale('ru')">ru</button>
  </div>

  <div>
    <h1>Color mode: {{ $colorMode.value }}</h1>
    <select v-model="$colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="sepia">Sepia</option>
    </select>
  </div>
</template>
