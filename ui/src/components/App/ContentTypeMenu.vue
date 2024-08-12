<script setup>
// import { resolveSmTypes } from "../lib/helpers.js";

const props = defineProps(["blogId"]);
const { t } = useI18n();
const userConfig = useState("userConfig");

const blogConf = userConfig.value.blogs.find(
  (item) => item.id === props.blogId,
);
const allTypes = {};

for (const sm of blogConf.socialMedia) {
  const smTypes = resolveSmTypes(sm);

  for (const item of smTypes) allTypes[item] = true;
}

const items = Object.keys(allTypes).map((postType) => ({
  label: t(`postType.${postType}`),
  to: `/blog/${props.blogId}/pub-${postType}`,
}));
</script>
<template>
  <Menu :model="items" class="w-full md:w-60">
    <template #item="{ item }">
      <SmartButton :item="item" />
    </template>
  </Menu>
</template>
