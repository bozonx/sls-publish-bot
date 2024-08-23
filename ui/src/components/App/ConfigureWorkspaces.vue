<script setup>
const { t } = useI18n();
const createModalOpen = ref(false);
const formModel = ref(null);

const handleCreateSave = () => {
  formModel.value?.submit();

  // TODO: wait for success and rize a toas
};

// watchEffect(() => {
//   emit("update:modelValue", form$.value);
// });
</script>

<template>
  <div>
    <SmartButton
      :label="$t('createWorkspace')"
      @click="createModalOpen = true"
    />
  </div>

  <SimpleFormModal
    v-model="createModalOpen"
    :header="$t('createWorkspaceModalHeader')"
    @save="handleCreateSave"
  >
    <FormCreateWorkspace v-model="formModel" />
  </SimpleFormModal>
</template>
