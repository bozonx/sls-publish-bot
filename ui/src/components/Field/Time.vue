<script setup>
const props = defineProps(["name", "label"]);
const { t } = useI18n();
</script>

<template>
  <TextElement :name="props.name || 'time'" :label="props.label || $t('time')" />
</template>
