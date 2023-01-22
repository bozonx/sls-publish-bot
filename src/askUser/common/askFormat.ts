import TgChat from '../../apiTg/TgChat.js';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../../types/constants.js';
import {breakArray} from '../../lib/arrays.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {AD_FORMATS, AdFormat} from '../../types/types.js';


const FORMAT_CB = 'FORMAT_CB|'


export async function askFormat(tgChat: TgChat, onDone: (format: AdFormat) => void) {
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
            BACK_BTN,
            CANCEL_BTN
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
        const format = splat[1] as AdFormat;

        await tgChat.reply(tgChat.app.i18n.commonPhrases.selectedFormat + format);

        onDone(format);
      }
    }
  );

}
