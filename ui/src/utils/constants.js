export const JWT_COOKIE_NAME = "apisessid";
export const TMP_STATE_TYPES = {
  articleToPublish: "articleToPublish",
};

export const BLOG_DEFAULT_YAML_CONFIG = `
socialMedia:
  - use: dzen
    types: ["article"]
    templates:
      - ["Main", "\${CONTENT}\n\n\nAuthor: [\${AUTHOR}](\${AUTHOR_URL})"]
  - use: telegram
    channelId: ""
    templates:
      - "some"
    postForArticleTemplates:
      - "some tg"
  - use: youtube
    types: ["podcast"]
  - use: blog
    postGitPath: "https://raw.githubusercontent.com/<githubUser>/<blog>/main/src/ru/post"
`;

export const PODCAST_TYPE_AUDIO = "audio";
export const PODCAST_TYPE_VIDEO = "video";
// do not change values - they are keys in db
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
