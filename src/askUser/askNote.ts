import TgChat from '../apiTg/TgChat';
import {askText} from './askText';


export async function askNote(tgChat: TgChat, onDone: (note: string) => void) {
  const msg = tgChat.app.i18n.menu.typeNote;

  return askText(msg, true, tgChat, onDone);
}
