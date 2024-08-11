<script setup>
import { resolveSocialMediaId } from "../lib/helpers.js";

const userConfig = useState("userConfig");
const props = defineProps(["blogId"]);
const { t } = useI18n();

const blogConf = userConfig.value.blogs?.find(
  (item) => item.id === props.blogId,
);
const items = blogConf.socialMedia
  .filter((item) => item.use !== "blog")
  .map((item) => ({
    id: resolveSocialMediaId(item),
    use: item.use,
    label: item.label || t("socialMedia." + item.use),
  }));
let selected = ref(items.map((item) => item.id));
</script>

<template>
  <div class="card flex flex-wrap justify-center gap-4">
    <div v-for="item in items" :key="item.id" class="flex items-center">
      <Checkbox v-model="selected" :inputId="item.id" :name="item.id" :value="item.id" />
      <label :for="item.id">
        {{ item.label }}
      </label>
    </div>
  </div>
</template>
