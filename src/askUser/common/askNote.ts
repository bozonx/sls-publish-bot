import TgChat from '../../apiTg/TgChat.js';
import {askPostText} from './askPostText.js';


export async function askNote(tgChat: TgChat, onDone: (note?: string) => void) {
  const msg = tgChat.app.i18n.menu.typeNote;

  return askPostText(tgChat, (textHtml?: string) => onDone(textHtml), msg);
}
