import {PublicationTypes, SnTypes} from './types';

export const MENU_MANAGE_SITE = 'manage_site';
//export const MENU_NEW_RAW_PAGE = 'new_raw_page';
export const DEFAULT_WAIT_EVENT_TIMEOUT_SEC = 30;
export const BACK_BTN_CALLBACK = 'back_btn';
export const CANCEL_BTN_CALLBACK = 'cancel_btn';
export const OK_BTN_CALLBACK = 'ok_btn';
export const CREATE_PREFIX = 'create_';
export const FULL_DATE_FORMAT = 'DD.MM.YYYY';

// export const SECTIONS_NAMES = {
//   Header: 'Header',
//   MainImage: 'MainImage',
//   MainImageDescr: 'MainImageDescr',
//   TgTags: 'TgTags',
//   InstaPostTags: 'InstaPostTags',
//   PostText: 'PostText',
//   ArticleText: 'ArticleText',
// };

export const PUBLICATION_TYPES: Record<PublicationTypes, PublicationTypes> = {
  article: 'article',
  post1000: 'post1000',
  post2000: 'post2000',
  mem: 'mem',
  photos: 'photos',
  story: 'story',
  narrative: 'narrative',
  announcement: 'announcement',
  poll: 'poll',
  reels: 'reels',
  video: 'video',
}

export const SN_TYPES: Record<SnTypes, SnTypes> = {
  telegram: 'telegram',
  instagram: 'instagram',
  zen: 'zen',
  site: 'site',
  youtube: 'youtube',
  tiktok: 'tiktok',
}

export const CONTENT_STATUS = {
  to_write: 'to_write',
  to_edit: 'to_edit',
  to_correct: 'to_correct',
  to_publish: 'to_publish',
  published: 'published',
};

export const CONTENT_PROPS = {
  date: 'date',
  time: 'time',
  gist: 'gist/link',
  note: 'note',
  status: 'status',
  onlySn: 'onlySn',
  type: 'type',
}

export const PAGE_CONTENT_PROPS = {
  title: 'title',
  announcement: 'announcement',
  imageDescr: 'imageDescr',
  instaTags: 'instaTags',
  tgTags: 'tgTags',
  textMd: 'textMd',
}

export enum AppEvents {
  CALLBACK_QUERY,
  MESSAGE,
}

export const BACK_BTN = {
  text: 'Back',
  callback_data: BACK_BTN_CALLBACK,
}

export const CANCEL_BTN = {
  text: 'Cancel',
  callback_data: CANCEL_BTN_CALLBACK,
}

export const OK_BTN = {
  text: 'OK',
  callback_data: OK_BTN_CALLBACK,
}

export const TASK_TYPES = {
  postponePost: 'postponePost',
  deletePost: 'deletePost',
};


// TODO: WTF????
// export enum PublicationTypes {
//   Article,
//   Post1000,
//   Post2000,
//   Story,
// }