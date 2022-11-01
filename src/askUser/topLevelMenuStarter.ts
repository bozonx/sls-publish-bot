import TgChat from '../apiTg/TgChat';
import {askMainMenu, SITE_SELECTED_RESULT} from './askMainMenu';
import {askBlogMenu, MENU_ADVERT, MENU_MAKE_STORY, MENU_PUBLISH} from './askBlogMenu';
import PublishFromContentPlan from '../publish/PublishFromContentPlan';
import {askSiteMenu} from './askSiteMenu';



export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, (blogName: string) => {
    if (blogName === SITE_SELECTED_RESULT) {
      // site selected
      return askSiteMenu(tgChat, () => {
        // TODO: What to do on done???
      })
        .catch((e) => tgChat.app.consoleLog.error(e));
    }

    askBlogMenu(
      tgChat,
      (action: string) => blogActionSelected(action, blogName, tgChat)
    )
      .catch((e) => tgChat.app.consoleLog.error(e));
  });
}


function blogActionSelected(action: string, blogName: string, tgChat: TgChat) {
  if (action === MENU_PUBLISH) {
    const publish = new PublishFromContentPlan(blogName, tgChat);

    publish.start()
      .catch((e) => tgChat.app.consoleLog.error(e));
  }
  else if (action === MENU_MAKE_STORY) {
    // TODO: do it
  }
  else if (action === MENU_ADVERT) {
    // TODO: do it
  }
}