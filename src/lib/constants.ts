export const APP_NAME = 'bozonx.publisher'
// TODO: get from squidlet
export const FILE_ENCODE = 'utf8'
export const DEFAULT_LANG = 'ru'
export const SUPPORTED_LANGS = ['ru']
export const COMMON_TAGS_MARK = '!COMON!'
export const POST_INDEX_YAML = 'index.yaml'
export const BLOG_YAML = 'blog.yaml'
export const APP_CONFIG_YAML = 'app.yaml'
export const TO_PUBLISH_DIR = 'toPublish'
export const ARCHIVE_DIR = 'archive'
export const TELEGRAPH_PER_PAGE = 10
export const PAGE_ID_LENGTH = 8
export const ALL_SNS = {
  telegram: 'telegram',
  dzen: 'dzen',
  youtube: 'youtube',
  spotifyForPodcasters: 'spotifyForPodcasters',
  mave: 'mave',
  site: 'site',
}
export const POST_TYPES = {
  article: 'article',
  image: 'image',
  // multiple image and videos
  gallery: 'gallery',
  text: 'text',
  short: 'short',
  audio: 'audio',
  video: 'video',
  poll: 'poll',
}
export type PostTypes = keyof typeof POST_TYPES

export const CONTENT_VIEW = {
  rendered: 'rendered',
  md: 'md',
  html: 'html',
  clean: 'clean',
}
