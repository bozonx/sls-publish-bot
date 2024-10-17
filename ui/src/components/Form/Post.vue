<script setup>
const props = defineProps([
  "modelValue",
  "preLoadedData",
  "method",
  "handleSuccess",
  // for creating
  "createdByUserId",
  // for creating
  "socialMediaId",
]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
const paramsFormModel = ref(null);

onMounted(async () => {
  if (props.preLoadedData)
    form$.value.load({
      ...props.preLoadedData,
      payloadJson: props.preLoadedData.payloadJson
        ? JSON.parse(props.preLoadedData.payloadJson)
        : {},
    });
});

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const prepareData = (FormData, form$) => {
  form$.data.payloadJson = JSON.stringify(paramsFormModel.value.data);
  form$.data.createdByUserId = props.createdByUserId;
  form$.data.socialMediaId = props.socialMediaId;

  return formSubmitHelper("/auth/posts")(FormData, form$);
};

const generateName = () => {
  // TODO: generate name
};
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

  <div class="mt-12">
    <FormPostParams v-model="paramsFormModel" :preLoadedData="form$?.data?.payloadJson" />
  </div>
</template>
