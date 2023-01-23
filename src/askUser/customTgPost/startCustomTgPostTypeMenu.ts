import TgChat from '../../apiTg/TgChat.js';
import {startTgPoll} from './startTgPoll.js';
import {askCustomTgPostTypeMenu, CUSTOM_POST_MENU_ACTIONS} from './askCustomTgPostTypeMenu.js';
import {startOrdinaryTgPost} from './startOrdinaryTgPost.js';


export async function startCustomTgPostTypeMenu(blogName: string, tgChat: TgChat) {
  await askCustomTgPostTypeMenu(blogName, tgChat, tgChat.asyncCb(async (action: string) => {
    switch (action) {
      case CUSTOM_POST_MENU_ACTIONS.POST1000:
        return await startOrdinaryTgPost(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.postFooter,
          true,
        );
      case CUSTOM_POST_MENU_ACTIONS.POST2000:
        return await startOrdinaryTgPost(
          blogName,
          tgChat,
          true,
          tgChat.app.blogs[blogName].sn.telegram?.postFooter,
          false
        );
      case CUSTOM_POST_MENU_ACTIONS.PHOTOS:
        return await startOrdinaryTgPost(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.postFooter,
          true,
          false
        );
      case CUSTOM_POST_MENU_ACTIONS.MEM:
        return await startOrdinaryTgPost(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.memFooter,
          true,
          // TODO: разрешить несколько картинок?
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.STORY:
        return await startOrdinaryTgPost(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.storyFooter,
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.REEL:
        return await startOrdinaryTgPost(
          blogName,
          tgChat,
          false,
          tgChat.app.blogs[blogName].sn.telegram?.reelFooter,
          true
        );
      case CUSTOM_POST_MENU_ACTIONS.POLL:
        return await startTgPoll(blogName, tgChat);
      default:
        throw new Error(`Unknown action ${action}`)
    }
  }));
}
