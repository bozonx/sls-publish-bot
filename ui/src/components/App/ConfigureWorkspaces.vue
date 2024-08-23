<script setup>
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const createModalOpen = ref(false);
const formModel = ref(null);

const { data, status, error } = await useApiList("workspaces");

const handleSave = () => {
  formModel.value?.submit();
};
</script>

<template>
  <SimpleList :data="data" :status="status" :error="error">
    <template #item="{ item }">
      <AppConfigWorkspaceItem :item="item" />
    </template>
  </SimpleList>

  <div>
    <SmartButton :label="$t('createWorkspace')" @click="createModalOpen = true" />
  </div>

  <SimpleFormModal v-model="createModalOpen" :header="$t('createWorkspaceModalHeader')" @save="handleSave">
    <FormCreateWorkspace v-model="formModel" />
  </SimpleFormModal>
</template>
