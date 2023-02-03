export const BACK_BTN_CALLBACK = 'BACK_BTN_CALLBACK';
export const CANCEL_BTN_CALLBACK = 'CANCEL_BTN_CALLBACK';
export const OK_BTN_CALLBACK = 'OK';
export const SKIP_BTN_CALLBACK = 'SKIP';
export const PRINT_FULL_DATE_FORMAT = 'DD.MM.YYYY';
export const PRINT_SHORT_DATE_TIME_FORMAT = 'DD.MM HH:mm';
export const PRINT_SHORT_DATE_FORMAT = 'DD.MM';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const TELEGRAM_MAX_CAPTION = 1024;
export const TELEGRAM_MAX_POST = 4096;
// TODO: проверить
export const INSTAGRAM_MAX_POST = 2048;
// TODO: проверить
export const ZEN_MAX_POST = 4096;
export const WARN_SIGN = '⚠';
// 24 days max
export const MAX_TIMEOUT_SECONDS = 2147483;
export const FILE_ENCODING = 'utf8';
export const MAX_INSTA_TAGS = 30

export enum ChatEvents {
  CALLBACK_QUERY,
  TEXT,
  PHOTO,
  VIDEO,
  //MEDIA_GROUP_ITEM,
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

// TODO: need translate
export const SKIP_BTN = {
  text: 'SKIP',
  callback_data: SKIP_BTN_CALLBACK,
}


// TODO: may be move to config ???
export const OFTEN_USED_TIME = [
  '7:30', '8:00', '10:00', '11:00', '12:30', '13:00',
  '15:00', '16:00', '17:00', '18:00', '18:30', '19:00'
]
