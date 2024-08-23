<script setup>
const props = defineProps(["item"]);

const { data, status, error } = await useApiList(
  `blogs?workspace-id=${props.item.id}`,
);
</script>

<template>
  <Card class="mb-2">
    <template #title>{{ props.item.name }}</template>
    <template #content>
      <SimpleList :data="data" :status="status" :error="error">
        <template #item="{ item }">
          <ListItem :label="item.name" :to="`/blog/${item.id}`" />
        </template>
      </SimpleList>
    </template>
    <div></div>
  </Card>
</template>
