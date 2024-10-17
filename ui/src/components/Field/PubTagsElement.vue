<script>
import { defineElement, TagsElement } from "@vueform/vueform";

export default defineElement({
  name: "CustomElement",
  setup(setupProps, { element }) {
    const props = toRefs(setupProps);
    const { update } = element;

    // update('value')
  },
  components: [TagsElement],
});
// const props = defineProps([
//   // "disabled",
//   // "fieldName",
//   // "formatData",
//   // "formatLoad",
//   // "id",
//   // "label",
//   "name",
//   // "submit",
//   "value",
// ]);

const handleChange = (aa, bb) => {
  console.log(1111, aa, bb);
};
</script>

<template>
  <ElementLayout>
    <template #element>
      iii
      {{ name }}
      <input />
      <!-- <TagsElement :native="false" :items="['Vue.js', 'React', 'AngularJS']" @change="handleChange" /> -->
      <!-- ADD YOUR ELEMENT TEMPLATE HERE -->
    </template>

    <!-- Default element slots -->
    <template v-for="(component, slot) in elementSlots" #[slot]>
      <slot :name="slot" :el$="el$">
        <component :is="component" :el$="el$" />
      </slot>
    </template>
  </ElementLayout>
</template>
