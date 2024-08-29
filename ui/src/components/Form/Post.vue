<script setup>
const props = defineProps([
  "modelValue",
  "loaded",
  // "userId",
  // "method",
]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);

// onMounted(async () => {
//   if (props.loaded) form$.value.load(props.loaded);
// });

watchEffect(() => {
  emit("update:modelValue", form$.value);
});

const handleSubmit = async (form$, FormData) => {
  // Using form$.data will INCLUDE conditional elements and it
  // will submit the form as "Content-Type: application/json".
  const data = form$.data;

  console.log(111, data);
};
</script>

<template>
  <div>
    <Vueform ref="form$" :endpoint="false" @submit="handleSubmit">
      <TextareaElement name="text" :label="$t('text')" />
    </Vueform>
  </div>
</template>
