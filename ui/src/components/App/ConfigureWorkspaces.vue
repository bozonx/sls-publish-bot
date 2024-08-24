<script setup>
const { t } = useI18n();

const { data: user } = await useApiMe();
const { data, status } = await useApiListWorkspaces();
const createModalOpen = ref(false);
const formModel = ref(null);

const handleSave = () => {
  formModel.value?.submit();

  console.log(1111, formModel.value);
  // TODO: go to item
  // /settings/workspace-${item.id}
};
</script>

<template>
  <SimpleList :data="data" :status="status">
    <template #item="{ item }">
      <ListItem :label="item.name" :to="`/settings/workspace-${item.id}`" />
    </template>
  </SimpleList>

  <div class="mt-4">
    <SmartButton :label="$t('createWorkspace')" @click="createModalOpen = true" />
  </div>

  <SimpleFormModal v-model="createModalOpen" :header="$t('createWorkspaceModalHeader')" @save="handleSave">
    <FormWorkspace v-model="formModel" :userId="user.id" />
  </SimpleFormModal>
</template>
