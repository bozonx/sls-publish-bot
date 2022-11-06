import TgChat from '../apiTg/TgChat';
import {askMainMenu, MENU_MANAGE_TELEGRAPH_CB, SITE_SELECTED_RESULT, TASKS_SELECTED_RESULT} from './askMainMenu';
import {askBlogMenu, BLOG_MENU_ACTIONS} from './askBlogMenu';
import {startPublishFromContentPlan} from '../publish/startPublishFromContentPlan';
import {askSiteMenu} from './askSiteMenu';
import {askTasksListMenu} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from './askTelegraphMenu';
import {startPublishStory} from '../publish/startPublishStory';
import {startPublishAdvert} from '../publish/startPublishAdvert';



export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, tgChat.asyncCb(async (blogNameOrAction: string) => {
    if (blogNameOrAction === SITE_SELECTED_RESULT) {
      // site selected
      return askSiteMenu(tgChat, () => {
        // TODO: What to do on done???
      });
    }
    else if (blogNameOrAction === TASKS_SELECTED_RESULT) {
      return askTasksListMenu(
        tgChat,
        (taskId: string) => askTaskMenu(taskId, tgChat, () => {
          tgChat.steps.back();
        })
      );
    }
    else if (blogNameOrAction === MENU_MANAGE_TELEGRAPH_CB) {
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
      return askBlogMenu(
        blogNameOrAction,
        tgChat,
        tgChat.asyncCb(
          async (action: string) => blogActionSelected(action, blogNameOrAction, tgChat)
        )
      );
    }
  }));
}


async function blogActionSelected(action: string, blogName: string, tgChat: TgChat) {
  if (action === BLOG_MENU_ACTIONS.CONTENT_PLAN) {
    await startPublishFromContentPlan(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.STORY) {
    await startPublishStory(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.MEM) {
    //await startPublishStory(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.REEL) {
    //await startPublishStory(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.POST) {
    //await startPublishStory(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.ADVERT) {
    await startPublishAdvert(blogName, tgChat);
  }
}
