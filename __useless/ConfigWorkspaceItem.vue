<script setup>
const props = defineProps(["item"]);
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const createModalOpen = ref(false);
const formModel = ref(null);

const { data, status, error } = await useApiList(
  `blogs?workspace-id=${props.item.id}`,
);

const handleCreateSave = () => {
  formModel.value?.submit();
};
</script>

<template>
  <Card class="mb-2">
    <template #title>{{ props.item.name }}</template>
    <template #content>
      <h4>{{ $t("blogs") }}</h4>

      <SimpleList :data="data" :status="status" :error="error">
        <template #item="{ item }">
          <ListItem :label="item.name" :to="`/settings/blog-${item.id}`" />
        </template>
      </SimpleList>

      <div>
        <SmartButton label="+" @click="createModalOpen = true" />
      </div>
    </template>
  </Card>
  <SimpleFormModal v-model="createModalOpen" :header="$t('createBlogModalHeader')" @save="handleCreateSave">
    <FormBlog v-model="formModel" :wpid="props.item.id" />
  </SimpleFormModal>
</template>
