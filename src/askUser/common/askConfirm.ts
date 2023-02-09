import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {compactUndefined} from '../../lib/arrays.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  makeOkBtn,
  OK_BTN_CALLBACK
} from '../../helpers/buttons.js';


export async function askConfirm(
  tgChat: TgChat,
  onDone: () => void,
  msgReplace?: string,
  disableOk = false,
) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      return [
        msgReplace || tgChat.app.i18n.commonPhrases.confirmation,
        [
          compactUndefined([
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n),
            (disableOk) ? undefined : makeOkBtn(tgChat.app.i18n),
          ])
        ]
      ]
    },
    (queryData: string) => {
      if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back();
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel();
      }
      else if (queryData === OK_BTN_CALLBACK) {
        onDone();
      }
    }
  );
}
