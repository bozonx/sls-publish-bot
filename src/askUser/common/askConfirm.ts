import TgChat from '../../apiTg/TgChat.js';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../../types/constants.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {compactUndefined} from '../../lib/arrays.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';


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
            BACK_BTN,
            CANCEL_BTN,
            (disableOk) ? undefined : OK_BTN,
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
