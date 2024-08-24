<script setup>
const props = defineProps(["data", "status"]);
const { t } = useI18n();
</script>

<template>
  <div>
    <div v-if="props.status === 'pending'">...</div>
    <div v-else-if="props.status === 'success' && !props.data?.length">
      <Message severity="secondary">{{ $t("emptyListMsg") }}</Message>
    </div>
    <ul v-else>
      <li v-for="item in props.data || []">
        <slot :item="item" name="item" />
      </li>
    </ul>
  </div>
</template>
