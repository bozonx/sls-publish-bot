export const MENU_MANAGE_SITE = 'manage_site';
//export const MENU_NEW_RAW_PAGE = 'new_raw_page';
//export const DEFAULT_WAIT_EVENT_TIMEOUT_SEC = 30;
export const BACK_BTN_CALLBACK = 'back_btn';
export const CANCEL_BTN_CALLBACK = 'cancel_btn';
export const OK_BTN_CALLBACK = 'ok_btn';
//export const CREATE_PREFIX = 'create_';
export const FULL_DATE_FORMAT = 'DD.MM.YYYY';


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

export const NOTION_BLOCK_TYPES = {
  heading_1: 'heading_1',
  heading_2: 'heading_2',
  heading_3: 'heading_3',
  paragraph: 'paragraph',
  bulleted_list_item: 'bulleted_list_item',
  numbered_list_item: 'numbered_list_item',
  quote: 'quote',
  code: 'code',
  divider: 'divider',
};

export const NOTION_RICH_TEXT_TYPES = {
  text: 'text',
}
