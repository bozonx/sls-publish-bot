import TgChat from '../../apiTg/TgChat';
import {breakArray} from '../../lib/arrays';
import {TgReplyButton} from '../../types/TgReplyButton';
import {addSimpleStep} from '../../helpers/helpers';
import {AD_FORMATS} from '../../types/types';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons';


const FORMAT_CB = 'FORMAT_CB|'


export async function askFormat(tgChat: TgChat, onDone: (format: keyof typeof AD_FORMATS) => void) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      return [
        tgChat.app.i18n.menu.selectFormat,
        [
          ...breakArray(Object.keys(AD_FORMATS).map((el): TgReplyButton => {
            return {
              text: el,
              callback_data: FORMAT_CB + el,
            };
          }), 4),
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
      else if (queryData.indexOf(FORMAT_CB) === 0) {
        const splat = queryData.split('|');
        const format = splat[1] as keyof typeof AD_FORMATS

        await tgChat.reply(tgChat.app.i18n.commonPhrases.selectedFormat + format);

        onDone(format);
      }
    }
  );

}
