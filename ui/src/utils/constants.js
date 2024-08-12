export const PODCAST_TYPE_AUDIO = "audio";
export const PODCAST_TYPE_VIDEO = "video";
export const SOCIAL_MEDIA_PARAMS = {
  blog: {
    types: ["article"],
  },
  dzen: {
    types: ["article", "post", "short"],
  },
  telegram: {
    types: ["post"],
  },
  youtube: {
    types: ["podcast", "video", "short"],
    podcastType: PODCAST_TYPE_VIDEO,
  },
  rutube: {
    types: ["podcast", "video", "short"],
    podcastType: PODCAST_TYPE_VIDEO,
  },
  tiktok: {
    types: ["short"],
  },
  spotify: {
    types: ["podcast"],
    podcastType: PODCAST_TYPE_AUDIO,
  },
  mave: {
    types: ["podcast"],
    podcastType: PODCAST_TYPE_AUDIO,
  },
};
export const PODCAST_PLATFORMS = ["spotify", "mave", "youtube"];
export const PUBLICATION_TYPES = [
  "article",
  "post",
  // video and audio podcast
  "podcast",
  // horizontal video
  "video",
  // vertical video
  "short",
];
