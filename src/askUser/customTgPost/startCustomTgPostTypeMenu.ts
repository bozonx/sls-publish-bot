import TgChat from '../../apiTg/TgChat.js';
import {startPublishPollTg} from './startPublishPollTg.js';
import {askCustomTgPostTypeMenu, CUSTOM_POST_MENU_ACTIONS} from './askCustomTgPostTypeMenu.js';
import {startPublishCustomPostTg} from './startPublishCustomPostTg.js';


export async function startCustomTgPostTypeMenu(blogName: string, tgChat: TgChat) {
  await askCustomTgPostTypeMenu(blogName, tgChat, tgChat.asyncCb(async (action: string) => {
    switch (action) {
      case CUSTOM_POST_MENU_ACTIONS.POST1000:
        return await startPublishCustomPostTg(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.postFooter,
          true,
          true,
        );
      case CUSTOM_POST_MENU_ACTIONS.POST2000:
        return await startPublishCustomPostTg(
          blogName,
          tgChat,
          true,
          tgChat.app.blogs[blogName].sn.telegram?.postFooter,
          false,
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.PHOTOS:
        //const footer = tgChat.app.blogs[blogName].sn.telegram?.postFooter;

        // await startPublishCustomPostTg(blogName, tgChat, footer);
        return
      case CUSTOM_POST_MENU_ACTIONS.MEM:
        return await startPublishCustomPostTg(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.memFooter,
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.STORY:
        return await startPublishCustomPostTg(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.storyFooter,
          true,
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.REEL:
        return await startPublishCustomPostTg(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.reelFooter,
          true,
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.POLL:
        return await startPublishPollTg(blogName, tgChat);
      default:
        throw new Error(`Unknown action ${action}`)
    }
  }));
}
