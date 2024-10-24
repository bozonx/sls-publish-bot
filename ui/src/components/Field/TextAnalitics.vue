<script setup>
const props = defineProps(["text"]);
const { t } = useI18n();

const count = ref(props.text?.length || 0);

watch(
  () => props.text,
  async (newValue) => {
    count.value = newValue?.length || 0;
  },
);
</script>

<template>
  <div class="col-span-12">
    <StaticElement name="textCount" :label="$t('textCharCount')">
      {{ count }}
    </StaticElement>
  </div>
</template>
