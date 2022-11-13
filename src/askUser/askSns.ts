import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';
import {breakArray, removeItemFromArray} from '../lib/arrays';
import {SnTypes} from '../types/ContentItem';


const SN_TO_REMOVE_CB = 'SN_TO_REMOVE_CB|'


export async function askSns(prevSns: string[], tgChat: TgChat, onDone: (tags: SnTypes[]) => void) {
  const msg = tgChat.app.i18n.menu.selectSns;
  const buttons = [
    ...breakArray(prevSns.map((el) => {
      return {
        text: el,
        callback_data: SN_TO_REMOVE_CB + el,
      }
    }), 3),
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
    else if (queryData.indexOf(SN_TO_REMOVE_CB) === 0) {
      const splat = queryData.split('|');
      const newSns = removeItemFromArray(prevSns, splat[1]);
      // print result
      await tgChat.reply(tgChat.app.i18n.commonPhrases.snsForPub + newSns.join(', '));
      onDone(newSns);
    }
  });

}
