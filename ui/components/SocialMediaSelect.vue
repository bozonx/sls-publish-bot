<script setup>
import { resolveSocialMediaId, resolveSmTypes } from "../lib/helpers.js";

const userConfig = useState("userConfig");
const props = defineProps(["blogId", "nextStepUrl", "postType"]);
const { t } = useI18n();

const blogConf = userConfig.value.blogs?.find(
  (item) => item.id === props.blogId,
);
const items = blogConf.socialMedia
  .filter(
    (item) =>
      item.use !== "blog" && resolveSmTypes(item).includes(props.postType),
  )
  .map((item) => ({
    id: resolveSocialMediaId(item),
    use: item.use,
    label: item.label || t("socialMedia." + item.use),
  }));
const selected = ref(items.map((item) => item.id));
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

  <div>
    <SmartButton :to="`${props.nextStepUrl}?sm=${encodeURIComponent(JSON.stringify(selected))}`"
      :label="$t('doSelect')" />
  </div>
</template>
