<script setup>
const props = defineProps(["item"]);
</script>

<template>
  <NuxtLink v-if="props.item.to" :to="props.item.to">
    <!-- <span :class="item.icon" /> -->
    <span>{{ props.item.label }}</span>
  </NuxtLink>
  <Button v-else>{{ props.item.label }}</Button>
</template>
