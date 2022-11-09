export const BACK_BTN_CALLBACK = 'BACK_BTN_CALLBACK';
export const CANCEL_BTN_CALLBACK = 'CANCEL_BTN_CALLBACK';
export const OK_BTN_CALLBACK = 'OK';
export const PRINT_FULL_DATE_FORMAT = 'DD.MM.YYYY';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const TELEGRAM_MAX_CAPTION = 1024;
export const TELEGRAM_MAX_POST = 4096;


export enum AppEvents {
  CALLBACK_QUERY,
  //MESSAGE,
  TEXT,
  PHOTO,
  MEDIA_GROUP_ITEM,
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
