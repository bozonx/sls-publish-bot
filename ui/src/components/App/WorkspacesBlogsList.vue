<script setup>
const props = defineProps(["data", "status", "error"]);
</script>

<template>
  <SimpleList v-bind="props">
    <template #item="{ item }">
      <ListItem :label="item.name" to="`/blog/${item.id}`" />
      <!-- <AppBlogsList :blogs="userConfig.blogs" class="mb-4" /> -->
    </template>
  </SimpleList>
</template>
