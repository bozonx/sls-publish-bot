import TgChat from '../../apiTg/TgChat';
import {breakArray} from '../../lib/arrays';
import {TgReplyButton} from '../../types/TgReplyButton';
import {addSimpleStep} from '../../helpers/helpers';
import {AD_BUY_TYPES} from '../../types/types';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons';


const BUY_AD_TYPE_CB = 'BUY_AD_TYPE_CB|'


export async function askBuyAdType(tgChat: TgChat, onDone: (adType: keyof typeof AD_BUY_TYPES) => void) {
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
        const adType = splat[1] as keyof typeof AD_BUY_TYPES;

        await tgChat.reply(tgChat.app.i18n.commonPhrases.type + adType);

        onDone(adType);
      }
    }
  );

}
