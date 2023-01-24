import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu.js';


export async function startTelegraphMenu(tgChat: TgChat) {
  await askTelegraphMenu(tgChat, (action: TelegraphMenu) => {
    switch (action) {
      case TELEGRAPH_MENU.TELEGRAPH_LIST:
        // TODO: add
        break;
      default:
        throw new Error(`Unknown action`)
    }
  })
}
