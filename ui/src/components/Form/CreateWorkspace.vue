<script setup>
const props = defineProps(["modelValue", "data"]);
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const form$ = ref(null);
const schema = ref({
  name: { type: "text", label: t("name") },
  cfg_yaml: { type: "hidden", default: "" },
  createdByUserId: { type: "hidden", default: 1 },
});

// onMounted(async () => {
// console.log(2222, form$.value);
//   schema.value = (await axios.get('/forms/login')).data
// });

watchEffect(() => {
  emit("update:modelValue", form$.value);
});
</script>

<template>
  <div>
    <!-- <div class="mb-8">Update your information.</div> -->

    <Vueform
      :endpoint="formSubmitHelper"
      method="post"
      ref="form$"
      :schema="schema"
    />
  </div>
</template>
