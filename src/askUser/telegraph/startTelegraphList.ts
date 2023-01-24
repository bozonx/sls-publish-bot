import {Page} from 'better-telegraph/src/types.js';
import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphList, TelegraphListMenu} from './askTelegraphList.js';


export async function startTelegraphList(tgChat: TgChat) {
  await askTelegraphList(tgChat, tgChat.asyncCb(async (page: Page) => {
    console.log(222222, page)
    if ()
    // TODO: what to do???
  }))
}