<script setup>
const { t } = useI18n();
const route = useRoute();
const confirm = useSimpleConfirm();
// const toast = useToast();

const { data: sn, status: snStatus } = await useApiGetSn(route.params.snId);
const snFormModel = ref(null);

definePageParams({
  title: makeSnName(sn.value),
  backUrl: `/settings/blog-${sn.value.blogId}`,
});

const handleSnSave = () => {
  snFormModel.value?.submit();
};

const handleSnDelete = () => {
  confirm(t("confirmDeletion"), t("sureDeleteSn"), t("delete"), async () => {
    const { status: deleteStatus } = await useApiDeleteSn(sn.value.id);

    if (deleteStatus.value === "success") {
      navigateTo(`/settings/blog-${sn.value.blogId}`);
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
  <Fieldset :legend="$t('socialMediaParams')">
    <FormSocialMedia v-model="snFormModel" :preLoadedData="sn" method="patch" />

    <div class="flex gap-x-2">
      <SmartButton :label="$t('save')" @click="handleSnSave" />
      <SmartButton :label="$t('deleteSn')" @click="handleSnDelete" />
    </div>
  </Fieldset>

  <Fieldset :legend="$t('manageSmTags')"> manage </Fieldset>
</template>
