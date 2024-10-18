<script setup>
const props = defineProps(["name", "label"]);
const { t } = useI18n();
</script>

<template>
  <FieldDate />
  <FieldTime />
</template>
