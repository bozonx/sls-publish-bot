export const PODCAST_TYPE_AUDIO = "audio";
export const PODCAST_TYPE_VIDEO = "video";
export const SOCIAL_MEDIAS = {
  blog: "blog",
  dzen: "dzen",
  telegram: "telegram",
  youtube: "youtube",
  rutube: "rutube",
  tiktok: "tiktok",
  spotify: "spotify",
  mave: "mave",
};
export const PUBLICATION_TYPES = {
  article: "article",
  post: "post",
  // video and audio podcast
  podcast: "podcast",
  // horizontal video
  video: "video",
  // vertical video
  short: "short",
};
export const SOCIAL_MEDIA_PARAMS = {
  [SOCIAL_MEDIAS.blog]: {
    types: [PUBLICATION_TYPES.article],
  },
  [SOCIAL_MEDIAS.dzen]: {
    types: [
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.post,
      PUBLICATION_TYPES.short,
    ],
  },
  [SOCIAL_MEDIAS.telegram]: {
    types: [PUBLICATION_TYPES.post],
  },
  [SOCIAL_MEDIAS.youtube]: {
    types: [
      PUBLICATION_TYPES.podcast,
      PUBLICATION_TYPES.video,
      PUBLICATION_TYPES.short,
    ],
    podcastType: PODCAST_TYPE_VIDEO,
  },
  [SOCIAL_MEDIAS.rutube]: {
    types: [
      PUBLICATION_TYPES.podcast,
      PUBLICATION_TYPES.video,
      PUBLICATION_TYPES.short,
    ],
    podcastType: PODCAST_TYPE_VIDEO,
  },
  [SOCIAL_MEDIAS.tiktok]: {
    types: [PUBLICATION_TYPES.short],
  },
  [SOCIAL_MEDIAS.spotify]: {
    types: [PUBLICATION_TYPES.podcast],
    podcastType: PODCAST_TYPE_AUDIO,
  },
  [SOCIAL_MEDIAS.mave]: {
    types: [PUBLICATION_TYPES.podcast],
    podcastType: PODCAST_TYPE_AUDIO,
  },
};
export const PODCAST_PLATFORMS = [
  SOCIAL_MEDIAS.spotify,
  SOCIAL_MEDIAS.mave,
  SOCIAL_MEDIAS.rutube,
];
