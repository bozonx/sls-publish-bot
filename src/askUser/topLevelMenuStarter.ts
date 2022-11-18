import TgChat from '../apiTg/TgChat';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu';
import {askSiteMenu} from './askSiteMenu';
import {askTasksListMenu} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu';
import {startBlogMenu} from './startBlogMenu';
import {startTaskMenu} from './startTaskMenu';
import {startSiteMenu} from './startSiteMenu';
import {startTelegraphMenu} from './startTelegraphMenu';


export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, tgChat.asyncCb(async (blogNameOrAction: string) => {
    if (blogNameOrAction === MAIN_MENU_ACTION.SITE) {
      await startSiteMenu(tgChat);
    }
    else if (blogNameOrAction === MAIN_MENU_ACTION.TASKS) {
      await startTaskMenu(tgChat);
    }
    else if (blogNameOrAction === MAIN_MENU_ACTION.TELEGRAPH) {
      await startTelegraphMenu(tgChat);
    }
    else {
      return startBlogMenu(blogNameOrAction, tgChat);
    }
  }));
}
