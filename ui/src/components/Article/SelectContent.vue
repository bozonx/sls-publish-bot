<script setup>
const props = defineProps(["blogConf", "nextStepUrl"]);
const tmpState = useTmpState();

const ACCORDION_SATES = {
  remote: "remote",
  local: "local",
};
const state = reactive({
  articlePath: "",
  articleText: "",
  accordionValue: ACCORDION_SATES.remote,
  loadedData: null,
  loadedError: null,
  loading: false,
});
const allowSubmit = computed({
  get: () => {
    if (
      state.accordionValue === ACCORDION_SATES.remote &&
      state.loading == false &&
      state.loadedData
    ) {
      return true;
    } else if (
      state.accordionValue === ACCORDION_SATES.local &&
      state.articleText
    ) {
      return true;
    }

    return false;
  },
});

function loadArticle() {
  state.loading = true;
  const postGitPath = props.blogConf.socialMedia.find(
    (item) => item.use === SOCIAL_MEDIAS.blog,
  )?.postGitPath;

  $fetch(`${postGitPath}/${state.articlePath}.md`)
    .then((res) => {
      const { content, frontmatter } = parseMdFile(res);
      state.loadedData = {
        content,
        frontmatter,
        meta: {
          title: extractTitleFromMd(content) || frontmatter.title,
          descr: frontmatter.previewText || frontmatter.description,
        },
      };
      state.loadedError = false;
      state.loading = false;
    })
    .catch((e) => {
      state.loadedData = null;
      state.loadedError = true;
      state.loading = false;
    });
}

function submit() {
  let res;

  if (state.accordionValue === ACCORDION_SATES.remote) {
    res = state.loadedData;
  } else {
    res = {
      content: state.articleText,
      frontmatter: {},
      meta: {},
    };
  }

  tmpState.value = {
    type: TMP_STATE_TYPES.articleToPublish,
    ...res,
  };

  navigateTo({
    path: props.nextStepUrl,
  });
}

// watch(
//   () => state.articleText,
//   (value, prevValue) => {
//     if (state.accordionValue !== ACCORDION_SATES.local) return;
//
//     state.submitDisabled = !value;
//   },
// );
</script>

<template>
  <Accordion v-model:value="state.accordionValue">
    <AccordionPanel :value="ACCORDION_SATES.remote">
      <AccordionHeader>{{ $t("loadArticleFromBlog") }}</AccordionHeader>
      <AccordionContent>
        <div>
          <InputText type="text" v-model="state.articlePath" :placeholder="$t('loadArticleInputPlaceholder')" />
          <SmartButton :label="$t('doLoad')" :pending="state.loading" :disabled="state.loading || !state.articlePath"
            @click="loadArticle" />
          <Message v-if="state.loadedError" severity="error">{{
            $t("articleLoadErrorMsg")
            }}</Message>
          <Message v-if="state.loadedData" severity="success">{{
            $t("articleLoadSuccessMsg")
            }}</Message>
        </div>
        <ArticleDetails :data="state.loadedData" />
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel :value="ACCORDION_SATES.local">
      <AccordionHeader>{{ $t("typeArticleText") }}</AccordionHeader>
      <AccordionContent>
        <div>
          <Textarea v-model="state.articleText" rows="5" cols="30" :placeholder="$t('articleTextAreaPlaceholder')" />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

  <div>
    <SmartButton :label="$t('doSelect')" :disabled="!allowSubmit" @click="submit" />
  </div>
</template>
