<script setup>
const props = defineProps(["items"]);
</script>

<template>
  <Menu :model="props.items" class="w-full md:w-60 mb-4">
    <template #item="{ item }">
      <SmartListItem :item="item" />
    </template>
  </Menu>
</template>
