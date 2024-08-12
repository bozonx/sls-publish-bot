<script setup>
const items = [
  {
    label: "some",
  },
];
</script>
<template>
  <Menubar :model="items">
    <template #item="{ item }">
      <SmartButton :item="item" />
    </template>
  </Menubar>
</template>
