<script setup>
const props = defineProps(["content"]);

const state = reactive({
  title: null,
  description: null,
  date: null,
  imgUrl: null,
  imgAlt: null,
  imgDescr: null,
  urlToVideo: null,
  tags: null,
});

watch(
  () => props.content,
  (value, prevValue) => {
    if (value === prevValue) return;
  },
);
</script>

<template>
  <div v-if="props.content">
    <div>{{ state.title }}</div>
    <div>{{ state.description }}</div>
    <div>{{ state.date }}</div>
    <div>{{ state.imgUrl }}</div>
    <div>{{ state.imgAlt }}</div>
    <div>{{ state.imgDescr }}</div>
    <div>{{ state.urlToVideo }}</div>
    <div>{{ state.tags }}</div>
  </div>
</template>
