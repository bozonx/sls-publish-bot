<script setup>
const userConfig = useState("userConfig");
const { t } = useI18n();
const props = defineProps([
  "blogId",
  "articleContent",
  "fetchError",
  "nextStepUrl",
]);
const blogConf = getBlogConf(props.blogId);
const dzenMenu = [{ label: t("generateFrorDzen") }];
const tgMenu = [];

if (
  blogConf.socialMedia
    .filter((item) => item.use === "telegram")
    .map((item) => Boolean(item.postForArticleTemplates))
    .includes(true)
) {
  tgMenu.push({
    label: t("generateTgPost"),
  });
}
</script>

<template>
  <Fieldset v-if="blogConf.socialMedia.find((item) => item.use === 'dzen')" :legend="$t('socialMedia.dzen')">
    <div>select dzen template</div>
    <SmartMenu :items="dzenMenu" />
  </Fieldset>
  <Fieldset v-if="tgMenu.length" :legend="$t('socialMedia.telegram')">
    <div>select tg template</div>
    <SmartMenu :items="tgMenu" />
  </Fieldset>

  <div>
    <SmartButton :to="`${props.nextStepUrl}`" :label="$t('doSelect')" />
  </div>
</template>
