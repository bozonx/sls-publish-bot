<script setup>
const props = defineProps(["item", "label", "to"]);
const label = ref(props.item?.label || props.label);
const to = ref(props.item?.to || props.to);

watchEffect(async () => {
  to.value = props.item?.to || props.to;
});

const SmButton = resolveComponent("Button");
const SmLink = resolveComponent("NuxtLink");
</script>

<template>
  <!-- <component :is="clickable ? MyButton : 'div'" /> -->
  <NuxtLink v-if="to" :to="to">
    <!-- <span :class="item.icon" /> -->
    <span>{{ label }}</span>
  </NuxtLink>
  <Button v-else>{{ label }}</Button>
</template>
