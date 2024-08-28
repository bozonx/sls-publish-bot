<script setup>
const props = defineProps(["blog", "status"]);
const { t } = useI18n();
const blogConf = getItemConf(props.blog);

const allTypes = {};

for (const sm of blogConf.yaml.socialMedia) {
  const smTypes = resolveSmTypes(sm);

  for (const item of smTypes) allTypes[item] = true;
}

const items = Object.keys(allTypes).map((postType) => ({
  label: t(`postType.${postType}`),
  to: `/blog/${props.blog.id}/pub-${postType}`,
}));
</script>

<template>
  <SmartMenu :items="items" />
</template>
