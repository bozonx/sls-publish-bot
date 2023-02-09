import TgChat from '../../apiTg/TgChat.js';
import {WARN_SIGN} from '../../types/constants.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {breakArray, removeItemFromArray} from '../../lib/arrays.js';
import {SnType} from '../../types/snTypes.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';


const SN_TO_REMOVE_CB = 'SN_TO_REMOVE_CB|'


export async function askSns(prevSns: string[], tgChat: TgChat, onDone: (tags: SnType[]) => void) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      return [
        tgChat.app.i18n.menu.selectSns,
        [
          ...breakArray(prevSns.map((el) => {
            return {
              text: el,
              callback_data: SN_TO_REMOVE_CB + el,
            }
          }), 3),
          [
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n)
          ],
        ]
      ]
    },
    async (queryData: string) => {
      if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back()
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel()
      }
      else if (queryData.indexOf(SN_TO_REMOVE_CB) === 0) {
        const splat = queryData.split('|')
        const newSns = removeItemFromArray(prevSns, splat[1])

        if (!newSns.length) {
          await tgChat.reply(WARN_SIGN + ' ' + tgChat.app.i18n.errors.needAlmostOneSn)

          return
        }

        // print result
        await tgChat.reply(tgChat.app.i18n.commonPhrases.snsForPub + newSns.join(', '));
        onDone(newSns);
      }
    }
  )

}
