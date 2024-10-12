<script setup>
const props = defineProps(["sns", "currentPath"]);
const { t } = useI18n();
const tmpState = useTmpState();
// TODO: WTF? why?
const dzenMenu = [
  { label: t("generateFrorDzen"), to: `${props.currentPath}/dzen` },
];
const tgMenu = [];

const allDzenSn = props.sns.filter((i) => i.type === SOCIAL_MEDIAS.dzen);
const allTelegramSn = props.sns.filter(
  (i) => i.type === SOCIAL_MEDIAS.telegram,
);
// const blogHasDzen = props.blogConf.yaml.socialMedia.find(
//   (item) => item.use === "dzen",
// );
// const blogHasTelegram = props.blogConf.yaml.socialMedia
//   .filter((item) => item.use === "telegram")
//   .map((item) => Boolean(item.postForArticleTemplates))
//   .includes(true);

if (allTelegramSn.length) {
  tgMenu.push({
    label: t("generateTgPost"),
  });
}

// TODO: select template
// if (tmpState.value)
//   tmpState.value.template = props.blogConf.yaml.socialMedia.find(
//     (item) => item.use === SOCIAL_MEDIAS.dzen,
//   )?.templates[0][1];
</script>

<template>
  <Message v-if="!tmpState" severity="error">
    {{ $t("stateLostMsg") }}
  </Message>
  <Message v-else-if="tmpState.type !== TMP_STATE_TYPES.articleToPublish" severity="error">
    {{ $t("stateWrongMsg") }}
  </Message>
  <template v-else>
    <Fieldset v-if="allDzenSn.length" :legend="$t('socialMedia.dzen')">
      <div>select dzen template</div>
      <SmartMenu :items="dzenMenu" />
    </Fieldset>
    <Fieldset v-if="tgMenu.length" :legend="$t('socialMedia.telegram')">
      <div>select tg template</div>
      <SmartMenu :items="tgMenu" />
    </Fieldset>
  </template>
</template>
