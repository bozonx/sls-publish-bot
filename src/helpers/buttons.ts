import ru from '../I18n/ru.js';
export const BACK_BTN_CALLBACK = 'BACK_BTN_CALLBACK';
export const CANCEL_BTN_CALLBACK = 'CANCEL_BTN_CALLBACK';
export const OK_BTN_CALLBACK = 'OK';
export const SKIP_BTN_CALLBACK = 'SKIP';


export function makeBackBtn(i18n: typeof ru) {
  return {
    text: i18n.buttons.back,
    callback_data: BACK_BTN_CALLBACK,
  }
}

export function makeCancelBtn(i18n: typeof ru) {
  return {
    text: i18n.buttons.cancel,
    callback_data: CANCEL_BTN_CALLBACK,
  }
}

export function makeOkBtn(i18n: typeof ru) {
  return {
    text: i18n.buttons.ok,
    callback_data: OK_BTN_CALLBACK,
  }
}

// export function makeSkipBtn(i18n: typeof ru) {
//   return {
//     text: i18n.buttons.skip,
//     callback_data: SKIP_BTN_CALLBACK,
//   }
// }
