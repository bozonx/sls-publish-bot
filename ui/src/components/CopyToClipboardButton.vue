<script setup>
const props = defineProps(["elementId"]);
function handleClick() {
  window.getSelection().removeAllRanges();

  let range = document.createRange();

  range.selectNode(document.getElementById(props.elementId));
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}
</script>

<template>
  <button @click="handleClick">
    <slot />
  </button>
</template>
