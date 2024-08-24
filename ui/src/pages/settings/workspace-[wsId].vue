<script setup>
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const { data: user } = await useApiMe();
const { data } = await useApiGetWorkspace(route.params.wsId);
const { data: blogs, status, error } = await useApiBlogsList(data.id);
const createModalOpen = ref(false);
const formModel = ref(null);
const createBlogModel = ref(null);

definePageParams({
  title: data.value.name,
  backUrl: `/settings`,
});

const handleSave = () => {
  formModel.value?.submit();
};
const handleCreateBlogSave = () => {
  createBlogModel.value?.submit();
};
</script>

<template>
  <FormWorkspace v-model="formModel" :loaded="data" method="patch" :userId="user.id" />

  <div>
    <SmartButton :label="$t('save')" @click="handleSave" />
  </div>

  <!-- <AppConfigWorkspaceItem :item="item" /> -->

  <SimpleList :data="blogs" :status="status" :error="error">
    <template #item="{ item }">
      <ListItem :label="item.name" :to="`/settings/blog-${item.id}`" />
    </template>
  </SimpleList>

  <div>
    <SmartButton label="+" @click="createModalOpen = true" />
  </div>

  <SimpleFormModal v-model="createModalOpen" :header="$t('createBlogModalHeader')" @save="handleCreateBlogSave">
    <FormBlog v-model="createBlogModel" :wpid="data.id" />
  </SimpleFormModal>
</template>
