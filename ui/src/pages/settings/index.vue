<script setup>
const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();

definePageParams({
  title: t("settings"),
});
// console.log(colorMode.preference);
</script>

<template>
  <Fieldset :legend="$t('workspaces')">
    <AppConfigureWorkspaces />
  </Fieldset>

  <div class="mt-6">
    <SmartButton @click="setLocale('en')" label="en" />
    <SmartButton @click="setLocale('ru')" label="ru" />
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
