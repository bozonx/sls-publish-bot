<script setup>
const props = defineProps(["item", "label", "to", "pending", "disabled"]);
const label = ref(props.item?.label || props.label);
const to = ref(props.item?.to || props.to);

watchEffect(async () => {
  to.value = props.item?.to || props.to;
});

// const SmButton = resolveComponent("Button");
// const SmLink = resolveComponent("NuxtLink");
const className = "rounded-md px-2 py-2 smart-btn";
</script>

<template>
  <!-- <component :is="clickable ? MyButton : 'div'" /> -->
  <NuxtLink v-if="to" :to="to" :class="className">
    <!-- <span :class="item.icon" /> -->
    <span>{{ label }}</span>
  </NuxtLink>
  <button v-else :class="className" :disabled="props.disabled">
    <span>{{ label }}</span>
  </button>
</template>

<style>
.smart-btn {
  background: var(--smart-btn-bg);
  color: var(--smart-btn-text);
}

.dark .smart-btn {
  background: var(--smart-btn-dark-bg);
  color: var(--smart-btn-dark-text);
}

.smart-btn[disabled] {
  background: var(--smart-btn-disabled-bg);
  color: var(--smart-btn-dark-disabled-text);
}

.dark .smart-btn[disabled] {
  background: var(--smart-btn-dark-disabled-bg);
  color: var(--smart-btn-dark-disabled-text);
}
</style>
