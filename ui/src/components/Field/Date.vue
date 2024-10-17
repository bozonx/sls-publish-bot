<script setup>
const props = defineProps(["name", "label"]);
const { t } = useI18n();
</script>

<template>
  <TextElement :name="props.name || 'date'" :label="props.label || $t('date')" />
</template>
