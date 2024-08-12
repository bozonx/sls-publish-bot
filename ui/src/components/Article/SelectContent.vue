<script setup>
const props = defineProps(["blogId", "nextStepUrl"]);
const userConfig = useState("userConfig");
const blogConf = getBlogConf(props.blogId);
const tmpState = useTmpState();

const ACCORDION_SATES = {
  remote: "remote",
  local: "local",
};
const state = reactive({
  articlePath: "",
  articleText: "",
  accordionValue: ACCORDION_SATES.remote,
  // submitDisabled: true,
  loadedContent: null,
  loadedError: null,
  loading: false,
});
const allowSubmit = computed({
  get: () => {
    if (
      state.accordionValue === ACCORDION_SATES.remote &&
      state.loading == false &&
      state.loadedContent
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
  // if (state.loading || !state.articlePath) return;

  state.loading = true;
  const postGitPath = blogConf.socialMedia.find(
    (item) => item.use === SOCIAL_MEDIAS.blog,
  )?.postGitPath;

  $fetch(`${postGitPath}/${state.articlePath}.md`)
    .then((res) => {
      state.loadedContent = res;
      state.loadedError = false;
      state.loading = false;
      // state.submitDisabled = false;
    })
    .catch((e) => {
      state.loadedContent = null;
      state.loadedError = true;
      state.loading = false;
      // state.submitDisabled = true;
    });
}

function submit() {
  // if (value) {
  //   tmpState.value = {
  //     type: TMP_STATE_TYPES.articleFromSite,
  //     value: props.articleContent,
  //   };
  // }
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
          <InputText
            type="text"
            v-model="state.articlePath"
            :placeholder="$t('loadArticleInputPlaceholder')"
          />
          <SmartButton
            :label="$t('doLoad')"
            :pending="state.loading"
            :disabled="state.loading || !state.articlePath"
            @click="loadArticle"
          />
          <Message v-if="state.loadedError" severity="error">{{
            $t("articleLoadErrorMsg")
          }}</Message>
          <Message v-if="state.loadedContent" severity="success">{{
            $t("articleLoadSuccessMsg")
          }}</Message>
        </div>
        <ArticleDetails :content="state.loadedContent" />
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel :value="ACCORDION_SATES.local">
      <AccordionHeader>{{ $t("typeArticleText") }}</AccordionHeader>
      <AccordionContent>
        <div>
          <Textarea
            v-model="state.articleText"
            rows="5"
            cols="30"
            :placeholder="$t('articleTextAreaPlaceholder')"
          />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

  <div>
    <SmartButton
      :label="$t('doSelect')"
      :disabled="!allowSubmit"
      @click="submit"
    />
  </div>
</template>
