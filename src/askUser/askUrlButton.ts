import TgChat from '../apiTg/TgChat';
import {isValidUrl, validateTime} from '../lib/common';
import {askText} from './askText';
import {TgReplyBtnUrl} from '../types/TgReplyButton';


export async function askUrlButton(tgChat: TgChat, onDone: (urlButton: TgReplyBtnUrl) => void) {
  const msg = tgChat.app.i18n.commonPhrases.typeBtnText;

  await askText(msg, false, tgChat, tgChat.asyncCb(async (text: string) => {
    const msg = tgChat.app.i18n.commonPhrases.typeBtnText;

    await askText(msg, false, tgChat, tgChat.asyncCb(async (url: string) => {
      onDone({text, url})
    }), (text: string) => {
      if (!isValidUrl(text)) throw new Error(tgChat.app.i18n.errors.incorrectUrl);
    });
  }));
}
