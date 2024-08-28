<script setup>
const props = defineProps(["blogConf"]);
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

    <section v-if="tmpState.meta.title">
      <h2>{{ $t("header") }}</h2>

      <CopyToClipboardButton elementId="dzen-header">
        {{ $t("copyToClipboard") }}
      </CopyToClipboardButton>

      <div id="dzen-header">{{ tmpState.meta.title }}</div>
    </section>

    <section>
      <h2>{{ $t("text") }}</h2>

      <CopyToClipboardButton elementId="dzen-content">
        {{ $t("copyToClipboard") }}
      </CopyToClipboardButton>

      <div id="dzen-content" v-html="contentHtml"></div>
    </section>
  </div>
</template>
