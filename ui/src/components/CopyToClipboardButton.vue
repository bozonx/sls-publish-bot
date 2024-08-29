<script setup>
const props = defineProps(["elementId"]);
const { t } = useI18n();

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
  <SmartButton @click="handleClick" :label="$t('copyToClipboard')">
    <slot />
  </SmartButton>
</template>
