<script setup>
const { t } = useI18n();
const route = useRoute();
const confirm = useSimpleConfirm();
// const toast = useToast();

const { data: workspace, status: workspaceStatus } = await useApiGetWorkspace(
  route.params.wsId,
);
const { data: blogs, status: blogsStatus } = await useApiListBlogs(
  workspace.value.id,
);
const createBlogModalOpen = ref(false);
const wsFormModel = ref(null);
const blogFormModel = ref(null);

definePageParams({
  title: workspace.value.name,
  backUrl: `/settings`,
});

const handleWorkspaceSave = () => {
  wsFormModel.value?.submit();
};

const handleCreateBlogSave = () => {
  blogFormModel.value?.submit();
};

const handleBlogSuccess = (response, form$) => {
  const id = response.data.id;

  navigateTo(`/settings/blog-${id}`);
};

const handleWorkspaceDelete = () => {
  confirm(
    t("confirmDeletion"),
    t("sureDeleteWorkspace"),
    t("delete"),
    async () => {
      const { status: deleteStatus } = await useApiDeleteWorkspace(
        workspace.value.id,
      );

      if (deleteStatus.value === "success") {
        navigateTo(`/settings`);
      }

      // toast.add({
      //   severity: "info",
      //   summary: "Confirmed",
      //   detail: "You have accepted",
      //   life: 3000,
      // });
    },
  );
};
</script>

<template>
  <template v-if="workspaceStatus === 'success'">
    <Fieldset :legend="$t('workspaceParams')">
      <FormWorkspace
        v-model="wsFormModel"
        :preLoadedData="workspace"
        method="patch"
      />

      <div class="flex gap-x-2 mb-6">
        <SmartButton :label="$t('save')" @click="handleWorkspaceSave" />
        <SmartButton
          :label="$t('deleteWorkspace')"
          @click="handleWorkspaceDelete"
          :disabled="blogs?.length"
        />
      </div>
    </Fieldset>

    <Fieldset :legend="$t('blogsOfWorkspace')">
      <SimpleList :data="blogs" :status="blogsStatus">
        <template #item="{ item }">
          <SmartListItem :label="item.name" :to="`/settings/blog-${item.id}`" />
        </template>
      </SimpleList>

      <div class="mt-4">
        <SmartButton
          :label="$t('createBlog')"
          @click="createBlogModalOpen = true"
        />
      </div>
    </Fieldset>

    <SimpleFormModal
      v-model="createBlogModalOpen"
      :header="$t('createBlogModalHeader')"
      @save="handleCreateBlogSave"
    >
      <FormBlog
        v-model="blogFormModel"
        :wpid="workspace.id"
        :handleSuccess="handleBlogSuccess"
      />
    </SimpleFormModal>
  </template>
</template>
