import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';


export async function askPostConfirm(
  blogName: string,
  tgChat: TgChat,
  onDone: () => void
) {
  const msg = tgChat.app.i18n.commonPhrases.publishConfirmation;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
      OK_BTN
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,(queryData: string) => {
    if (queryData === BACK_BTN_CALLBACK) {
      return tgChat.steps.back();
    }
    else if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    else if (queryData === OK_BTN_CALLBACK) {
      onDone();
    }
  });
}
