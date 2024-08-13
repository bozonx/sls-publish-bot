<script setup>
const props = defineProps(["data"]);

// const state = reactive({
//   title: null,
//   description: null,
//   date: null,
//   imgUrl: null,
//   imgAlt: null,
//   imgDescr: null,
//   urlToVideo: null,
//   tags: null,
//   contentCount: null,
// });
//
// watch(
//   () => props.content,
//   (value, prevValue) => {
//     if (value === prevValue) return;
//
//     state.title = ;
//     state.description =
//       state.date = props.frontmatter.date;
//     state.cover = props.frontmatter.cover;
//     state.coverAlt = frontmatter.coverAlt;
//     state.coverDescr = frontmatter.coverDescr;
//     state.videoLink = frontmatter.videoLink;
//     state.tags = frontmatter.tags;
//     state.;
//   },
// );
</script>

<template>
  <div v-if="props.data">
    <div v-if="props.data.meta.title">title: {{ props.data.meta.title }}</div>
    <div v-if="props.data.frontmatter.date">
      date: {{ props.data.frontmatter.date }}
    </div>
    <div v-if="props.data.frontmatter.cover">
      cover: {{ props.data.frontmatter.cover }}
    </div>
    <div v-if="props.data.frontmatter.coverAlt">
      coverAlt: {{ props.data.frontmatter.coverAlt }}
    </div>
    <div v-if="props.data.frontmatter.coverDescr">
      coverDescr: {{ props.data.frontmatter.coverDescr }}
    </div>
    <div v-if="props.data.frontmatter.videoLink">
      videoLink: {{ props.data.frontmatter.videoLink }}
    </div>
    <div v-if="props.data.frontmatter.tags">
      tags: {{ props.data.frontmatter.tags.join(", ") }}
    </div>
    <div v-if="props.data.content">
      content chars count: {{ props.data.content?.trim().length }}
    </div>
    <div v-if="props.data.meta.descr">
      description: {{ props.data.meta.descr }}
    </div>
  </div>
</template>
