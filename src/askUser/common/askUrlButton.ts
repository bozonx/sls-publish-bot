import TgChat from '../../apiTg/TgChat.js';
import {isValidUrl} from '../../lib/common.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {askText} from './askText.js';


export async function askUrlButton(tgChat: TgChat, onDone: (urlButton?: TgReplyBtnUrl) => void) {
  const msg = tgChat.app.i18n.commonPhrases.typeBtnText;

  await askText(tgChat, tgChat.asyncCb(async (textHtml?: string, cleanText?: string) => {
    const msg = tgChat.app.i18n.commonPhrases.typeBtnUrl;

    if (!cleanText) {
      onDone()

      return
    }

    await askText(
      tgChat,
      tgChat.asyncCb(async (textHtml?: string, cleanUrl?: string) => {
        onDone({text: cleanText, url: cleanUrl!})
      }),
      msg,
      false,
      undefined,
      (textHtml?: string, cleanUrlToValidate?: string) => {
        if (!isValidUrl(cleanUrlToValidate)) throw new Error(tgChat.app.i18n.errors.incorrectUrl);
      }
    );
  }), msg, true, tgChat.app.i18n.commonPhrases.withoutUrlBtn);
}
