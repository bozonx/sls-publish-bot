<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status, error } = await useApiBlog(route.params.blogId);
const formModel = ref(null);

const handleSave = () => {
  formModel.value?.submit();
};
</script>

<template>
  <div>blog {{ route.params.blogId }}</div>

  <FormBlog v-model="formModel" :loaded="data" method="patch" />

  <div>
    <SmartButton :label="$t('save')" @click="handleSave" />
  </div>
</template>
