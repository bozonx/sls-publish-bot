<script setup>
const props = defineProps(["items"]);
</script>
<template>
  <Menu :model="props.items" class="w-full md:w-60">
    <template #item="{ item }">
      <SmartButton :item="item" />
    </template>
  </Menu>
</template>
