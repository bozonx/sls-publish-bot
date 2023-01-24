import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu.js';
import {askTelegraphList} from './askTelegraphList.js';


export async function startTelegraphMenu(tgChat: TgChat) {
  await askTelegraphMenu(tgChat, (action: TelegraphMenu) => {
    switch (action) {
      case TELEGRAPH_MENU.TELEGRAPH_LIST:
        askTelegraphList(tgChat, () => {
          // TODO: what to do???
        })
        break;
      default:
        throw new Error(`Unknown action`)
    }
  })
}
