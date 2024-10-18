<script setup>
const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();

const { data: me } = await useApiMe();
const userFormModel = ref(null);

definePageParams({
  title: t("settings"),
});

const handleUserSave = () => {
  userFormModel.value?.submit();
};

// console.log(colorMode.preference);
</script>

<template>
  <Fieldset :legend="$t('workspaces')">
    <AppConfigureWorkspaces />
  </Fieldset>

  <Fieldset :legend="$t('userConfig')">
    <FormUserConfig
      v-model="userFormModel"
      :preLoadedData="me"
      method="patch"
    />
    <SmartButton :label="$t('save')" @click="handleUserSave" />
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
