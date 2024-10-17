<script setup>
const props = defineProps(["modelValue", "preLoadedData", "handleSubmit"]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);

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
  form$.data.createdByUserId = props.createdByUserId;
  // form$.data.socialMediaId = props.socialMediaId;
  // TODO: add name, payloadJson?

  return formSubmitHelper("/auth/posts")(FormData, form$);
};

const handleSubmit = async (form$, FormData) => {
  // Using form$.data will INCLUDE conditional elements and it
  // will submit the form as "Content-Type: application/json".
  const data = form$.data;

  console.log(111, data);
};

// :endpoint="false"
//  @submit="handleSubmit"

// TODO: add - media, tags, template, author
</script>

<template>
  <Vueform :endpoint="false" ref="form$" @submit="handleSubmit">
    <TextElement name="customAuthor" :label="$t('customAuthor')" />

    <CheckboxElement name="noAuthor">
      {{ t("noAuthor") }}
    </CheckboxElement>

    <TextElement name="date" :label="$t('date')" />
    <TextElement name="time" :label="$t('time')" />
  </Vueform>
</template>
