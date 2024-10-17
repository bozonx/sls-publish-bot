<script setup>
const props = defineProps(["name", "label"]);
const { t } = useI18n();

const items = ["Vue.js", "React", "AngularJS"];
</script>

<template>
  <TagsElement :name="props.name || 'tags'" :label="props.label || 'tags'" :native="false" :items="items"
    @change="handleChange" />
</template>
