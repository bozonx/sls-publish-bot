<script setup>
const { t } = useI18n();
const router = useRouter();

// const { data: user } = await useApiMe();
const { data, status } = await useApiListMyWorkspaces();
const createModalOpen = ref(false);
const formModel = ref(null);

const handleSave = () => {
  formModel.value?.submit();
};

const handleSuccess = (response, form$) => {
  const id = response.data.id;

  router.push(`/settings/workspace-${id}`);
};
</script>

<template>
  <SimpleList :data="data" :status="status">
    <template #item="{ item }">
      <SmartListItem :label="item.name" :to="`/settings/workspace-${item.id}`" />
    </template>
  </SimpleList>

  <div class="mt-4">
    <SmartButton :label="$t('createWorkspace')" @click="createModalOpen = true" />
  </div>

  <SimpleFormModal v-model="createModalOpen" :header="$t('createWorkspaceModalHeader')" @save="handleSave">
    <FormWorkspace v-model="formModel" :handleSuccess="handleSuccess" />
  </SimpleFormModal>
</template>
