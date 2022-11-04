import TgChat from '../apiTg/TgChat';
import {askMainMenu, MENU_MANAGE_TELEGRAPH_CB, SITE_SELECTED_RESULT, TASKS_SELECTED_RESULT} from './askMainMenu';
import {askBlogMenu, MENU_ADVERT, MENU_MAKE_STORY, MENU_PUBLISH} from './askBlogMenu';
import {startPublishFromContentPlan} from '../publish/startPublishFromContentPlan';
import {askSiteMenu} from './askSiteMenu';
import {askTasksListMenu} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';



export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, (blogNameOrAction: string) => {
    if (blogNameOrAction === SITE_SELECTED_RESULT) {
      // site selected
      return askSiteMenu(tgChat, () => {
        // TODO: What to do on done???
      })
        .catch((e) => tgChat.app.consoleLog.error(e));
    }
    else if (blogNameOrAction === TASKS_SELECTED_RESULT) {
      return askTasksListMenu(
        tgChat,
        (taskId: string) => askTaskMenu(taskId, tgChat, () => {
          tgChat.steps.back();
        })
      )
        .catch((e) => tgChat.app.consoleLog.error(e));
    }
    else if (blogNameOrAction === MENU_MANAGE_TELEGRAPH_CB) {

    }
    else {
      askBlogMenu(
        tgChat,
        tgChat.asyncCb(
          async (action: string) => blogActionSelected(action, blogNameOrAction, tgChat)
        )
      )
        .catch((e) => tgChat.app.consoleLog.error(e));
    }
  });
}


async function blogActionSelected(action: string, blogName: string, tgChat: TgChat) {
  if (action === MENU_PUBLISH) {
    await startPublishFromContentPlan(blogName, tgChat);
  }
  else if (action === MENU_MAKE_STORY) {
    // TODO: do it
  }
  else if (action === MENU_ADVERT) {
    // TODO: do it
  }
}
