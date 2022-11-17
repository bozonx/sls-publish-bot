import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import {breakArray} from '../lib/arrays';
import {TgReplyButton} from '../types/TgReplyButton';
import {addSimpleStep} from '../helpers/helpers';
import {AD_BUY_TYPES, BuyAdType} from '../types/types';


const BY_AD_TYPE_CB = 'BY_AD_TYPE_CB|'


export async function askBuyAdType(tgChat: TgChat, onDone: (adType: BuyAdType) => void) {
  const msg = tgChat.app.i18n.menu.selectFormat;
  const buttons = [
    ...breakArray(Object.keys(AD_BUY_TYPES).map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: BY_AD_TYPE_CB + el,
      };
    }), 2),
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
    else if (queryData.indexOf(BY_AD_TYPE_CB) === 0) {
      const splat = queryData.split('|');
      const adType: BuyAdType = splat[1] as BuyAdType;

      await tgChat.reply(tgChat.app.i18n.commonPhrases.type + adType);

      onDone(adType);
    }
  });

}
