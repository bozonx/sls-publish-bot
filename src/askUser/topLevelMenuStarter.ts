import TgChat from '../apiTg/TgChat';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu';
import {startBlogMenu} from './startBlogMenu';
import {startTaskMenu} from './startTaskMenu';
import {startSiteMenu} from './startSiteMenu';
import {startTelegraphMenu} from './startTelegraphMenu';


export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, tgChat.asyncCb(async (blogNameOrAction: string) => {
    switch (blogNameOrAction) {
      case MAIN_MENU_ACTION.SITE:
        return startSiteMenu(tgChat);
      case MAIN_MENU_ACTION.TASKS:
        return startTaskMenu(tgChat);
      case MAIN_MENU_ACTION.TELEGRAPH:
        return startTelegraphMenu(tgChat);
      default:
        return startBlogMenu(blogNameOrAction, tgChat);
    }
  }));
}
