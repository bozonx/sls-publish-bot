import {PublicationTypes} from './PublicationTypes';

export const MENU_MANAGE_SITE = 'manage_site';
export const MENU_NEW_RAW_PAGE = 'new_raw_page';
export const DEFAULT_WAIT_EVENT_TIMEOUT_SEC = 30;
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
  story: 'story',
}

export enum AppEvents {
  CALLBACK_QUERY,
}

// TODO: WTF????
// export enum PublicationTypes {
//   Article,
//   Post1000,
//   Post2000,
//   Story,
// }