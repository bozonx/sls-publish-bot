import TgChat from '../apiTg/TgChat';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu';
import {askBlogMenu} from './askBlogMenu';
import {askSiteMenu} from './askSiteMenu';
import {askTasksListMenu} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu';


export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, tgChat.asyncCb(async (blogNameOrAction: string) => {
    if (blogNameOrAction === MAIN_MENU_ACTION.SITE) {
      // site selected
      return askSiteMenu(tgChat, tgChat.asyncCb(async  () => {
        await tgChat.reply('Under construction');
        await tgChat.steps.cancel();
      }));
    }
    else if (blogNameOrAction === MAIN_MENU_ACTION.TASKS) {
      return askTasksListMenu(
        tgChat,
        (taskId: string) => askTaskMenu(taskId, tgChat, () => {
          tgChat.steps.back();
        })
      );
    }
    else if (blogNameOrAction === MAIN_MENU_ACTION.TELEGRAPH) {
      return askTelegraphMenu(tgChat, (action: TelegraphMenu) => {
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
    else {
      return askBlogMenu(blogNameOrAction, tgChat);
    }
  }));
}
