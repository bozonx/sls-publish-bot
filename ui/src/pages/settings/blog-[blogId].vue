<script setup>
const { t } = useI18n();
const route = useRoute();
const confirm = useSimpleConfirm();
// const toast = useToast();

const { data: blog, status: blogStatus } = await useApiGetMyBlog(
  route.params.blogId,
);
const { data: sns, status: snsStatus } = await useApiListMySns(
  route.params.blogId,
);
const createSnModalOpen = ref(false);
const blogFormModel = ref(null);
const snFormModel = ref(null);

definePageParams({
  title: blog.value.name,
  backUrl: `/settings/workspace-${blog.value.workspaceId}`,
});

const handleBlogSave = () => {
  blogFormModel.value?.submit();
};

const handleCreateSnSave = () => {
  snFormModel.value?.submit();
};

const handleSnSuccess = (response, form$) => {
  const id = response.data.id;

  navigateTo(`/settings/sn-${id}`);
};

const handleBlogDelete = () => {
  confirm(t("confirmDeletion"), t("sureDeleteBlog"), t("delete"), async () => {
    const { status: deleteStatus } = await useApiDeleteMyBlog(blog.value.id);

    if (deleteStatus.value === "success") {
      navigateTo(`/settings/workspace-${blog.value.workspaceId}`);
    }

    // toast.add({
    //   severity: "info",
    //   summary: "Confirmed",
    //   detail: "You have accepted",
    //   life: 3000,
    // });
  });
};
</script>

<template>
  <template v-if="blogStatus === 'success'">
    <FormBlog v-model="blogFormModel" :preLoadedData="blog" method="patch" />

    <div class="flex gap-x-2">
      <SmartButton :label="$t('save')" @click="handleBlogSave" />
      <SmartButton
        :label="$t('deleteBlog')"
        @click="handleBlogDelete"
        :disabled="sns?.length"
      />
    </div>

    <Fieldset :legend="$t('manageBlogTags')"> manage </Fieldset>

    <Fieldset :legend="$t('snsOfBlog')">
      <SimpleList :data="sns" :status="snsStatus">
        <template #item="{ item }">
          <SmartListItem
            :label="makeSnName(item)"
            :to="`/settings/sn-${item.id}`"
          />
        </template>
      </SimpleList>

      <div class="mt-4">
        <SmartButton
          :label="$t('createSn')"
          @click="createSnModalOpen = true"
        />
      </div>
    </Fieldset>

    <SimpleFormModal
      v-model="createSnModalOpen"
      :header="$t('createSnModalHeader')"
      @save="handleCreateSnSave"
    >
      <FormSocialMedia
        v-model="snFormModel"
        :blogId="blog.id"
        :handleSuccess="handleSnSuccess"
      />
    </SimpleFormModal>
  </template>
</template>
