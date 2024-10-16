<script setup>
const props = defineProps(["postData"]);
const { t } = useI18n();

const form$ = ref(null);
// TODO: собрать ссылки из текста
const linkUrls = ["https://ya.ru"];

// onMounted(async () => {
//   if (props.preLoadedData)
//     form$.value.load({
//       ...props.preLoadedData,
//       // payloadJson:
//       //   props.preLoadedData.payloadJson &&
//       //   stringifyYaml(JSON.parse(props.preLoadedData.payloadJson)),
//     });
// });

const handleSubmit = async (form$, FormData) => {
  // Using form$.data will INCLUDE conditional elements and it
  // will submit the form as "Content-Type: application/json".
  const data = form$.data;

  console.log(111, data);
};

const handleTgPublish = () => {
  console.log(222);
};

// TODO: add previewLink, previewLinkOnTop
</script>

<template>
  <Vueform :endpoint="false" ref="form$" @submit="handleSubmit">
    <SelectElement v-if="linkUrls.length > 0" name="previewLink" :native="false" :items="linkUrls"
      :label="$t('previewLink')" />
    <CheckboxElement name="previewLinkOnTop">
      {{ t("previwLinkOnTop") }}
    </CheckboxElement>
  </Vueform>

  <div class="mt-4">
    <SmartButton :label="$t('schedulePost')" @click="handleTgPublish" />
  </div>
</template>
