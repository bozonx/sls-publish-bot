<script setup>
const route = useRoute();
const { t } = useI18n();

const { data, status } = await useApiGetBlog(route.params.blogId);
const blogConf = getItemConf(data.value);
const postModel = ref(null);

definePageParams({
  categoryTitle: data.value.name,
  categoryUrl: `/blog/${route.params.blogId}`,
  title: t("contentSelect"),
});
</script>

<template>
  <FormPost v-model="postModel" />
</template>
