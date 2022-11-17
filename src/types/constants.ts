export const BACK_BTN_CALLBACK = 'BACK_BTN_CALLBACK';
export const CANCEL_BTN_CALLBACK = 'CANCEL_BTN_CALLBACK';
export const OK_BTN_CALLBACK = 'OK';
export const PRINT_FULL_DATE_FORMAT = 'DD.MM.YYYY';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const TELEGRAM_MAX_CAPTION = 1024;
export const TELEGRAM_MAX_POST = 4096;
export const WARN_SIGN = '⚠';

export enum ChatEvents {
  CALLBACK_QUERY,
  TEXT,
  PHOTO,
  MEDIA_GROUP_ITEM,
  POLL
}

// TODO: need translate
export const BACK_BTN = {
  text: 'Back',
  callback_data: BACK_BTN_CALLBACK,
}

// TODO: need translate
export const CANCEL_BTN = {
  text: 'Cancel',
  callback_data: CANCEL_BTN_CALLBACK,
}

// TODO: need translate
export const OK_BTN = {
  text: 'OK',
  callback_data: OK_BTN_CALLBACK,
}

// TODO: may be move to config ???
export const OFTEN_USED_TIME = [
  '7:30', '8:00', '10:00', '11:00', '12:30', '13:00',
  '15:00', '16:00', '17:00', '18:00', '18:30', '19:00'
]
