<script setup>
const pageParams = usePageParams();
</script>
<template>
  <div class="flex w-full">
    <SmartButton v-if="pageParams.backUrl" label="<" :to="pageParams.backUrl" />
    <SmartButton v-if="pageParams.showHome" label="home" to="/" />
    <SmartButton v-if="pageParams.categoryTitle" :label="pageParams.categoryTitle" :to="pageParams.categoryUrl" />
  </div>
  <div>
    {{ pageParams.title }}
  </div>
</template>
