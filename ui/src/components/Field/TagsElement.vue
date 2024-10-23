<script>
import { defineElement, TagsElement } from "@vueform/vueform";

export default defineElement({
  name: "FieldTagsElement",
  nullValue: [],
  setup(setupProps, { element }) {
    const props = toRefs(setupProps);
    const { update, model } = element;
    const inputValue = ref("");
    const defaultClasses = ref({
      container: "form-text form-text-type ", // added to the element's outermost DOM in ElementLayout
      inputWrapper:
        "w-full flex flex-1 transition-input duration-200 border-solid form-border-width-input form-shadow-input form-input-group group form-radius-input form-h-input-height form-bg-input-success form-color-input-success form-border-color-input-success hover:form-shadow-input-hover focused:form-shadow-input-focus focused:form-ring focused-hover:form-shadow-input-hover",
      input:
        "w-full bg-transparent h-full form-p-input form-radius-input form-text with-floating:form-p-input-floating form-color-input-success form-autofill-success",
      input_danger: "has-errors",
      input_sm: "text-sm",
      input_md: "text-base",
      input_lg: "text-lg",
      $input: (classes, { Size }) => [
        classes.input,
        classes[`input_${Size}`],
        // isDanger ? classes.input_danger : null,
      ],
    });

    const handleInput = (event) => {
      inputValue.value = event.target.value;
    };

    const handleAddTags = async () => {
      const tags = parseTagsFromInput(inputValue.value);

      update([...model.value, ...tags]);

      inputValue.value = "";
    };

    return {
      handleInput,
      inputValue,
      defaultClasses,
      handleAddTags,
      input: ref(null),
    };
  },
});
</script>

<template>
  <ElementLayout>
    <template #element>
      <div v-if="value?.length" class="mb-4">
        <Tag v-for="tag of value" severity="warn" :value="tag" />
      </div>
      <div :class="classes.inputWrapper">
        <input
          ref="input"
          type="text"
          :name="name"
          :id="name"
          :value="inputValue"
          @input="handleInput"
          v-bind="aria"
          :class="classes.input"
          :placeholder="$t('writeNewTags')"
        />
      </div>
      <ButtonElement
        name="addTags"
        :submit="false"
        :disabled="!inputValue"
        @click="handleAddTags"
        >{{ $t("add") }}
      </ButtonElement>
    </template>
  </ElementLayout>
</template>
