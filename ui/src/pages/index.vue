<script setup>
const userConfig = useState("userConfig");
</script>

<template>
  <MainMenu class="mb-4" />
  <BlogsList :blogs="userConfig.blogs" />
</template>
