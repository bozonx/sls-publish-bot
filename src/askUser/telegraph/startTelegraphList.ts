import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphList, TelegraphListMenu} from './askTelegraphList.js';


export async function startTelegraphList(tgChat: TgChat) {
  await askTelegraphList(tgChat, tgChat.asyncCb(async (action: TelegraphListMenu) => {
    // TODO: what to do???
  }))
}