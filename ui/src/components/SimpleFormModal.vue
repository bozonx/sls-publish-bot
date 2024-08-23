<script setup>
const props = defineProps(["modelValue", "header"]);
const emit = defineEmits(["update:modelValue", "cancel", "save"]);
const { t } = useI18n();
const modalOpen = ref(false);

const handleCancel = () => {
  emit("update:modelValue", false);
  emit("cancel");
};

const handleSave = () => {
  emit("update:modelValue", false);
  emit("save");
};
</script>

<template>
  <Dialog
    :visible="props.modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    modal
    dismissableMask
    closeOnEscape
    :header="props.header"
    :style="{ width: '25rem' }"
  >
    <slot />

    <template #footer>
      <Button
        :label="$t('cancel')"
        text
        severity="secondary"
        @click="handleCancel"
        autofocus
      />
      <Button
        :label="$t('save')"
        outlined
        severity="secondary"
        @click="handleSave"
        autofocus
      />
    </template>
  </Dialog>
</template>
