<script setup>
const { t } = useI18n();
// const props = defineProps(["blogConf"]);
const tmpState = useTmpState();

/*

let post = simpleTemplate(
  replaceLineBreak(meta.dzen?.template || meta.common?.postTemplate),
  {
    CONTENT: convertCommonMdToCommonHtml((data.post.result.md || '').trim()),
    FOOTER: convertCommonMdToCommonHtml((
      meta.dzen?.footer
      || ((meta.type === POST_TYPES.article)
        ? meta.common?.footer
        : meta.common?.postFooter)
      || ''
    ).trim()),
  }
)
*/

const contentHtml = ref(
  tmpState.value &&
  fullConvertArticleFromMdToHtml(
    tmpState.value.content,
    tmpState.value.template,
    // TODO: replace to real
    "test author",
    "https://ya.ru",
  ),
);

// console.log(1111, tmpState.value, contentHtml.value);
</script>

<template>
  <Message v-if="!tmpState" severity="error">
    {{ $t("stateLostMsg") }}
  </Message>
  <Message v-else-if="tmpState.type !== TMP_STATE_TYPES.articleToPublish" severity="error">
    {{ $t("stateWrongMsg") }}
  </Message>
  <div v-else>
    <!-- <section> -->
    <!--   <h2>{$t('headers.reminder')}</h2> -->
    <!--   <RenderHtml html={convertCommonMdToCommonHtml($t('texts.dzenHint').trim())} /> -->
    <!-- </section> -->

    <Fieldset v-if="tmpState.meta.title" :legend="$t('header')">
      <div class="mb-4">
        <CopyToClipboardButton elementId="dzen-header" />
      </div>

      <div id="dzen-header">{{ tmpState.meta.title }}</div>
    </Fieldset>

    <Fieldset :legend="$t('text')">
      <div class="mb-4">
        <CopyToClipboardButton elementId="dzen-content" />
      </div>

      <div id="dzen-content" v-html="contentHtml" class="whitespace-normal"></div>
    </Fieldset>
  </div>
</template>
