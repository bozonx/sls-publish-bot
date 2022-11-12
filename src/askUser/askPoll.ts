import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';


export async function askPoll(tgChat: TgChat, onDone: () => void) {
  const msg = tgChat.app.i18n.menu.makePoll;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN
    ],
  ];

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if (queryData === BACK_BTN_CALLBACK) {
      return tgChat.steps.back();
    }
    else if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }

  });

}
