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
import {AD_SELL_TYPES, SellAdType} from '../types/types';


const SELL_AD_TYPE_CB = 'SELL_AD_TYPE_CB|'


export async function askSellAdType(tgChat: TgChat, onDone: (adType: SellAdType) => void) {
  const msg = tgChat.app.i18n.commonPhrases.selectAdType;
  const buttons = [
    ...breakArray(Object.keys(AD_SELL_TYPES).map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: SELL_AD_TYPE_CB + el,
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
    else if (queryData.indexOf(SELL_AD_TYPE_CB) === 0) {
      const splat = queryData.split('|');
      const adType = splat[1] as SellAdType;

      await tgChat.reply(tgChat.app.i18n.commonPhrases.type + adType);

      onDone(adType);
    }
  });

}
