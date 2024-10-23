<script>
import { defineElement, TagsElement } from "@vueform/vueform";

export default defineElement({
  name: "FieldTagsElement",
  setup(setupProps, { element }) {
    const props = toRefs(setupProps);
    const { update, model } = element;
    const customAuthor = ref(null);
    const customAuthorInput = ref("");
    const noAuthorInput = ref(false);
    const userAuthorName = ref(null);
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

    useApiMe().then((res) => {
      userAuthorName.value = res.data.value.cfg.authorName;

      if (!model.value) model.value = userAuthorName.value;
    });

    const handleCustomAuthorInput = (event) => {
      customAuthorInput.value = event.target.value;

      update(event.target.value);
    };

    const handleSetUserAuthor = async () => {
      // const tags = parseTagsFromInput(inputValue.value);
      //
      // update([...model.value, ...tags]);
      //
      // inputValue.value = "";
    };

    const handleNoAuthorChange = (isChecked) => {
      if (isChecked) {
        update(null);
      }

      noAuthorInput.value = isChecked;
    };

    return {
      defaultClasses,
      customAuthor,
      customAuthorInput,
      noAuthorInput,
      userAuthorName,
      handleCustomAuthorInput,
      handleSetUserAuthor,
      handleNoAuthorChange,
    };
  },
});
</script>

<template>
  <ElementLayout>
    <template #element>
      <div :class="classes.inputWrapper">
        <input
          type="text"
          :disabled="true"
          :name="name"
          :id="name"
          :value="value"
          :class="classes.input"
        />
      </div>
      <div :class="classes.inputWrapper">
        <input
          ref="customAuthor"
          type="text"
          :value="customAuthorInput"
          @input="handleCustomAuthorInput"
          v-bind="aria"
          :class="classes.input"
          :placeholder="$t('customAuthor')"
        />
      </div>
      <!-- <CheckboxElement -->
      <!--   name="noAuthor" -->
      <!--   :value="noAuthorInput" -->
      <!--   @change="handleNoAuthorChange" -->
      <!-- > -->
      <!--   {{ $t("noAuthor") }} -->
      <!-- </CheckboxElement> -->
      <ButtonElement
        v-if="userAuthorName"
        name="setAuthorName"
        secondary
        :submits="false"
        :button-label="$t('setAuthor') + ': ' + userAuthorName"
        :disabled="noAuthorInput || customAuthorInput === userAuthorName"
        @click="handleSetUserAuthor"
      />
    </template>
  </ElementLayout>
</template>
