<script setup>
const props = defineProps(["blogs"]);
</script>

<template>
  <DataView :value="props.blogs">
    <template #list="{ items }">
      <div>
        <SmartButton v-for="item in items" :item="{ label: item.label, to: `/blog/${item.id}` }" />
      </div>
    </template>
  </DataView>
</template>
