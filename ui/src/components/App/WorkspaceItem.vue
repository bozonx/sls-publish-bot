<script setup>
const props = defineProps(["item"]);

const { data, status } = await useApiListBlogs(props.item.id);
</script>

<template>
  <Card class="mb-2">
    <template #title>{{ props.item.name }}</template>
    <template #content>
      <SimpleList :data="data" :status="status">
        <template #item="{ item }">
          <SmartListItem :label="item.name" :to="`/blog/${item.id}`" />
        </template>
      </SimpleList>
    </template>
    <div></div>
  </Card>
</template>
