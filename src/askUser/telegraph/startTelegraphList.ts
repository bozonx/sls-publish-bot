import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphList} from './askTelegraphList.js';


export async function startTelegraphList(tgChat: TgChat) {
  await askTelegraphList(tgChat, () => {
    // TODO: what to do???
  })
}