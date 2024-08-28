<script setup>
const props = defineProps(["item", "label", "to", "pending", "disabled"]);
</script>

<template>
  <SmartButton v-bind="props" class="smart-list-item" />
</template>

<style>
.smart-list-item {
  border-radius: 0;
  display: block;
  background: var(--gray-100);
  color: var(--gray-900);
}

.dark .smart-list-item {
  background: var(--gray-850);
  color: var(--gray-200);
}

.smart-list-item[disabled] {
  background: var(--gray-300);
  color: var(--gray-600);
}

.dark .smart-list-item[disabled] {
  background: var(--gray-700);
  color: var(--gray-500);
}
</style>
