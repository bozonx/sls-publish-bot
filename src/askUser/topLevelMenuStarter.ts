import TgChat from '../apiTg/TgChat.js';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu.js';
import {startBlogMenu} from './startBlogMenu.js';
import {startTaskMenu} from './task/startTaskMenu.js';
import {startSiteMenu} from './startSiteMenu.js';
import {startTelegraphMenu} from './startTelegraphMenu.js';


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
