import TgChat from '../apiTg/TgChat.js';
import {askSiteMenu} from './askSiteMenu.js';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './task/askTelegraphMenu.js';


export async function startTelegraphMenu(tgChat: TgChat) {
  await askTelegraphMenu(tgChat, (action: TelegraphMenu) => {
    switch (action) {
      case TELEGRAPH_MENU.LOGIN:
        // TODO: add
        break;
      case TELEGRAPH_MENU.LIST:
        // TODO: add
        break;
      default:
        break;
    }
  })
}
