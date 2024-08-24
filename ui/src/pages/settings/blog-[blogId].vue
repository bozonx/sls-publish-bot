<script setup>
const route = useRoute();
const { t } = useI18n();

const { data: user } = await useApiMe();
const { data, status, error } = await useApiBlog(route.params.blogId);
const formModel = ref(null);

definePageParams({
  title: data.value.name,
  backUrl: `/settings`,
});

const handleSave = () => {
  formModel.value?.submit();
};
</script>

<template>
  <FormBlog v-model="formModel" :loaded="data" method="patch"" :userId="user.id" />

  <div>
    <SmartButton :label="$t('save')" @click="handleSave" />
  </div>
</template>
