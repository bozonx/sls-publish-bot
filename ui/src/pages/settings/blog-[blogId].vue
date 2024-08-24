<script setup>
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();

const { data: user } = await useApiMe();
const { data, status } = await useApiGetBlog(route.params.blogId);
const formModel = ref(null);

definePageParams({
  title: data.value.name,
  backUrl: `/settings/workspace-${data.value.workspaceId}`,
});

const handleSave = () => {
  formModel.value?.submit();
};

const handleDelete = () => {
  confirm.require({
    message: t("sureDeleteBlog"),
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
      const { status: deleteStatus } = await useApiDeleteBlog(data.value.id);

      if (deleteStatus.value === "success") {
        router.push(`/settings/workspace-${data.value.workspaceId}`);
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
  <FormBlog v-model="formModel" :loaded="data" method="patch" :userId="user.id" />

  <div>
    <SmartButton :label="$t('save')" @click="handleSave" />
    <SmartButton :label="$t('deleteBlog')" @click="handleDelete" />
  </div>

  <ConfirmDialog></ConfirmDialog>
</template>
