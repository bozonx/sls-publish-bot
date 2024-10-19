<script setup>
const props = defineProps(["item", "label", "to", "pending", "disabled"]);
const label = ref(props.item?.label || props.label);
const to = ref(props.item?.to || props.to);

watchEffect(async () => {
  to.value = props.item?.to || props.to;
});

// const SmButton = resolveComponent("Button");
// const SmLink = resolveComponent("NuxtLink");
// const className = "rounded-md px-2 py-2 smart-btn";
</script>

<template>
  <!-- <component :is="clickable ? MyButton : 'div'" /> -->
  <NuxtLink v-if="to" :to="to" class="smart-btn">
    <!-- <span :class="item.icon" /> -->
    <span>{{ label }}</span>
  </NuxtLink>
  <button v-else class="smart-btn" :disabled="props.disabled">
    <span>{{ label }}</span>
  </button>
</template>

<style>
.smart-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: var(--gray-100);
  color: var(--gray-900);
  white-space: nowrap;
}

.dark .smart-btn {
  background: var(--gray-700);
  color: var(--gray-100);
}

.smart-btn[disabled] {
  background: var(--gray-300);
  color: var(--gray-600);
}

.dark .smart-btn[disabled] {
  background: var(--gray-700);
  color: var(--gray-500);
}
</style>
