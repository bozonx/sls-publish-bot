<script setup>
const userConfig = useState("userConfig");

definePageMeta({
  title: "My home page",
});
</script>

<template>
  <MainMenu class="mb-4" />
  <BlogsList :blogs="userConfig.blogs" />
</template>
