import {PublicationTypes, SnTypes} from './types';

export const MENU_MANAGE_SITE = 'manage_site';
//export const MENU_NEW_RAW_PAGE = 'new_raw_page';
export const DEFAULT_WAIT_EVENT_TIMEOUT_SEC = 30;
export const BACK_BTN_CALLBACK = 'back_btn';
export const CANCEL_BTN_CALLBACK = 'cancel_btn';
export const OK_BTN_CALLBACK = 'ok_btn';
export const CREATE_PREFIX = 'create_';

export const SN_TYPES: Record<SnTypes, SnTypes> = {
  telegram: 'telegram',
  instagram: 'instagram',
  zen: 'zen',
}

export const SECTIONS_NAMES = {
  Header: 'Header',
  MainImage: 'MainImage',
  MainImageDescr: 'MainImageDescr',
  TgTags: 'TgTags',
  InstaPostTags: 'InstaPostTags',
  PostText: 'PostText',
  ArticleText: 'ArticleText',
};

export const PUBLICATION_TYPES: Record<PublicationTypes, PublicationTypes> = {
  article: 'article',
  post1000: 'post1000',
  post2000: 'post2000',
  photos: 'photos',
  story: 'story',
  narrative: 'narrative',
  announcement: 'announcement',
  poll: 'poll',
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

// TODO: WTF????
// export enum PublicationTypes {
//   Article,
//   Post1000,
//   Post2000,
//   Story,
// }