<script setup>
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
// const toast = useToast();

const { data: user } = await useApiMe();
const { data: workspace } = await useApiGetWorkspace(route.params.wsId);
const { data: blogs, status } = await useApiListBlogs(workspace.value.id);
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

  router.push(`/settings/blog-${id}`);
};

const handleDeleteWorkspace = () => {
  confirm.require({
    message: t("sureDeleteWorkspace"),
    header: t("confirmDeletion"),
    // icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: async () => {
      const { status: deleteStatus } = await useApiDeleteWorkspace(
        workspace.value.id,
      );

      if (deleteStatus.value === "success") {
        router.push(`/settings`);
      }

      // toast.add({
      //   severity: "info",
      //   summary: "Confirmed",
      //   detail: "You have accepted",
      //   life: 3000,
      // });
    },
    // reject: () => {
    //   toast.add({
    //     severity: "error",
    //     summary: "Rejected",
    //     detail: "You have rejected",
    //     life: 3000,
    //   });
    // },
  });
};
</script>

<template>
  <FormWorkspace v-model="wsFormModel" :loaded="workspace" method="patch" :userId="user.id" />

  <div>
    <SmartButton :label="$t('save')" @click="handleWorkspaceSave" />
    <SmartButton :label="$t('deleteWorkspace')" @click="handleDeleteWorkspace" :disabled="blogs?.length" />
  </div>

  <SectionHeader>{{ $t("blogsOfWorkspace") }}</SectionHeader>

  <SimpleList :data="blogs" :status="status">
    <template #item="{ item }">
      <ListItem :label="item.name" :to="`/settings/blog-${item.id}`" />
    </template>
  </SimpleList>

  <div>
    <SmartButton label="+" @click="createBlogModalOpen = true" />
  </div>

  <SimpleFormModal v-model="createBlogModalOpen" :header="$t('createBlogModalHeader')" @save="handleCreateBlogSave">
    <FormBlog v-model="blogFormModel" :wpid="workspace.id" :handleSuccess="handleBlogSuccess" />
  </SimpleFormModal>

  <ConfirmDialog></ConfirmDialog>
</template>
