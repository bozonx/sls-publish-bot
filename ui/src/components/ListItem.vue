<script setup>
const props = defineProps(["item", "label", "to", "pending", "disabled"]);
</script>

<template>
  <SmartButton v-bind="props" />
</template>
