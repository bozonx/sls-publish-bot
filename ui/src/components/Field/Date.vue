<script setup>
const props = defineProps(["name", "blog"]);
const { t } = useI18n();

// function makeClosestDayLabel(plusDay) {
//   const isoDateStr = todayPlusDaysIsoDate(
//     plusDay,
//     blog.value.cfg.PUBLICATION_TIME_ZONE,
//   );
//   const shortDate = makeShortDateFromIsoDate(isoDateStr);
//
//   if (plusDay <= 2) {
//     return t(`closestDays.${plusDay}`) + ` ${shortDate}`;
//   }
//
//   return getShortWeekDay(isoDateStr) + ` ${shortDate}`;
// }

const dateRef = ref(null);
const defaultDate = todayPlusDaysIsoDate(
  props.blog.cfg.PUBLICATION_DEFAULT_PLUS_DAY,
  props.blog.cfg.PUBLICATION_TIME_ZONE,
);
// const dateBtns = [
//   {
//     label: makeClosestDayLabel(0),
//     value: 0,
//   },
//   {
//     label: makeClosestDayLabel(1),
//     value: 1,
//   },
//   {
//     label: makeClosestDayLabel(2),
//     value: 2,
//   },
//   ...[3, 4, 5, 6].map((i) => ({
//     label: makeClosestDayLabel(i),
//     value: i,
//   })),
// ];

// const handleDateBtnClick = (plusDayNum) => {
//   dateRef.value.value = todayPlusDaysIsoDate(plusDayNum);
// };
</script>

<template>
  <DateElement :name="props.name || 'date'" :default="defaultDate" :columns="{ container: 2 }" ref="dateRef" />
  <!-- <div class="col-span-12"> -->
  <!--   <template v-for="item in dateBtns"> -->
  <!--     <SmartButton :label="item.label" @click.prevent="handleDateBtnClick(item.value)" /> -->
  <!--   </template> -->
  <!-- </div> -->
</template>
