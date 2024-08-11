<script setup>
const userConfig = useState("userConfig");
</script>

<template>
  <MainMenu />
  <BlogsList :blogs="userConfig.blogs" />
</template>
