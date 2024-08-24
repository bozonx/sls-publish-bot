<script setup>
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const createModalOpen = ref(false);
const formModel = ref(null);

const { data: user } = await useApiMe();
const { data, status, error } = await useWorkspacesList();

const handleSave = () => {
  formModel.value?.submit();
};
</script>

<template>
  <SimpleList :data="data" :status="status" :error="error">
    <template #item="{ item }">
      <SmartButton :label="item.name" :to="`/settings/workspace-${item.id}`" />
    </template>
  </SimpleList>

  <div>
    <SmartButton :label="$t('createWorkspace')" @click="createModalOpen = true" />
  </div>

  <SimpleFormModal v-model="createModalOpen" :header="$t('createWorkspaceModalHeader')" @save="handleSave">
    <FormWorkspace v-model="formModel" :userId="user.id" />
  </SimpleFormModal>
</template>
