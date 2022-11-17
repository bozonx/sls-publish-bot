import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  FORMATS,
} from '../types/constants';
import {breakArray} from '../lib/arrays';
import {TgReplyButton} from '../types/TgReplyButton';
import {addSimpleStep} from '../helpers/helpers';


const FORMAT_CB = 'FORMAT_CB|'


export async function askFormat(tgChat: TgChat, onDone: (time: string) => void) {
  const msg = tgChat.app.i18n.menu.selectTime;
  const buttons = [
    ...breakArray(FORMATS.map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: FORMAT_CB + el,
      };
    }), 4),
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
    else if (queryData.indexOf(FORMAT_CB) === 0) {
      const splat = queryData.split('|');

      onDone(splat[1]);
    }
  });

}
