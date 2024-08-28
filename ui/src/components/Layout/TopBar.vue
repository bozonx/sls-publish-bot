<script setup>
const pageParams = usePageParams();
</script>
<template>
  <div>
    <div class="flex w-full gap-x-2 py-2">
      <SmartButton v-if="pageParams.backUrl" label="<" :to="pageParams.backUrl" />
      <SmartButton v-if="pageParams.showHome" label="home" to="/" />
      <SmartButton v-if="pageParams.categoryTitle" :label="pageParams.categoryTitle" :to="pageParams.categoryUrl" />
    </div>
    <h1 class="pt-3 pb-6 font-bold">
      {{ pageParams.title }}
    </h1>
  </div>
</template>
