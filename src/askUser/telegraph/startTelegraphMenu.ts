import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu.js';
import {startTelegraphList} from './startTelegraphList.js';


export async function startTelegraphMenu(tgChat: TgChat) {
  await askTelegraphMenu(tgChat, tgChat.asyncCb(async (action: TelegraphMenu) => {
    switch (action) {
      case TELEGRAPH_MENU.TELEGRAPH_LIST:
        return await startTelegraphList(tgChat)
      default:
        throw new Error(`Unknown action`)
    }
  }))
}
