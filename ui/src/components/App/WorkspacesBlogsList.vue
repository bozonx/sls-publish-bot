<script setup>
const props = defineProps(["data", "status", "error"]);
</script>

<template>
  <SimpleList v-bind="props">
    <template #item="{ item }">
      <AppWorkspaceItem :item="item" />
    </template>
  </SimpleList>
</template>
