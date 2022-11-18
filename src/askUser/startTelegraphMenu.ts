import TgChat from '../apiTg/TgChat';
import {askSiteMenu} from './askSiteMenu';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu';


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
