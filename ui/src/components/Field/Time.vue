<script setup>
const props = defineProps(["name", "blog"]);
const route = useRoute();
const { t } = useI18n();

const timeRef = ref(null);
const defaultTime = props.blog.cfg.DEFAULT_PUB_TIME;
const hourBtns = [
  ...[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(
    (i) => i + ":00",
  ),
];

const handleHourBtnClick = (time) => {
  timeRef.value.value = normalizeTime(time);
};
</script>

<template>
  <DateElement :name="props.name || 'time'" :date="false" :time="true" :default="defaultTime"
    :columns="{ container: 12, wrapper: 2 }" ref="timeRef" />
  <div class="col-span-12">
    <template v-for="time in hourBtns">
      <SmartButton :label="time" @click.prevent="handleHourBtnClick(time)" />
    </template>
  </div>
</template>
