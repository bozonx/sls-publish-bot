<script setup>
const props = defineProps(["blogId"]);
const { t } = useI18n();
// const userConfig = useState("userConfig");
// const tmpState = useTmpState();
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
  <Fieldset
    v-if="blogConf.socialMedia.find((item) => item.use === 'dzen')"
    :legend="$t('socialMedia.dzen')"
  >
    <div>select dzen template</div>
    <SmartMenu :items="dzenMenu" />
  </Fieldset>
  <Fieldset v-if="tgMenu.length" :legend="$t('socialMedia.telegram')">
    <div>select tg template</div>
    <SmartMenu :items="tgMenu" />
  </Fieldset>
</template>
