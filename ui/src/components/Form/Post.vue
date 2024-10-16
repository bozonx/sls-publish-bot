<script setup>
const props = defineProps([
  "modelValue",
  "preLoadedData",
  "method",
  "handleSuccess",
  "createdByUserId",
  "socialMediaId",
]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);

console.log(11111, props.preLoadedData);

onMounted(async () => {
  if (props.preLoadedData)
    form$.value.load({
      ...props.preLoadedData,
      // payloadJson:
      //   props.preLoadedData.payloadJson &&
      //   stringifyYaml(JSON.parse(props.preLoadedData.payloadJson)),
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  // form$.data.cfg = JSON.stringify(parseYaml(form$.data.cfg)) || "";
  // TODO: add name, payloadJson?, createdByUserId, socialMediaId

  return formSubmitHelper("/auth/posts")(FormData, form$);
};

const generateName = () => {
  // TODO: generate name
};

// const handleSubmit = async (form$, FormData) => {
//   // Using form$.data will INCLUDE conditional elements and it
//   // will submit the form as "Content-Type: application/json".
//   const data = form$.data;
//
//   console.log(111, data);
// };

// :endpoint="false"
//  @submit="handleSubmit"

// TODO: add - media, tags, template, author, noAuthor, customAuthor, date, time
</script>

<template>
  <Vueform :endpoint="prepareData" :method="props.method" ref="form$" @success="props.handleSuccess">
    <div class="flex gap-x-2 col-span-12 w-full">
      <div class="flex-1">
        <TextElement name="name" :label="$t('name')" />
      </div>
      <div class="flex items-end">
        <SmartButton :label="$t('generate')" @click.prevent="generateName" />
      </div>
    </div>
    <TextareaElement name="text" :label="$t('textMd')" />
  </Vueform>
</template>
