import TgChat from '../../apiTg/TgChat.js';
import {breakArray} from '../../lib/arrays.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {AD_BUY_TYPES, BuyAdType} from '../../types/types.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';


const BUY_AD_TYPE_CB = 'BUY_AD_TYPE_CB|'


export async function askBuyAdType(tgChat: TgChat, onDone: (adType: BuyAdType) => void) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      return [
        tgChat.app.i18n.commonPhrases.selectAdType,
        [
          ...breakArray(Object.keys(AD_BUY_TYPES).map((el): TgReplyButton => {
            return {
              text: el,
              callback_data: BUY_AD_TYPE_CB + el,
            };
          }), 2),
          [
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n)
          ],
        ]
      ]
    },
    async (queryData: string) => {
      if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back();
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel();
      }
      else if (queryData.indexOf(BUY_AD_TYPE_CB) === 0) {
        const splat = queryData.split('|');
        const adType = splat[1] as BuyAdType;

        await tgChat.reply(tgChat.app.i18n.commonPhrases.type + adType);

        onDone(adType);
      }
    }
  );

}
