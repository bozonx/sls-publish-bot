<script setup>
const props = defineProps(["data", "status"]);
const pending = props.status === "pending";
</script>

<template>
  <div>
    <div v-if="pending">...</div>
    <ul v-else>
      <li v-for="item in props.data">
        <slot :item="item" name="item" />
      </li>
    </ul>
  </div>
</template>
