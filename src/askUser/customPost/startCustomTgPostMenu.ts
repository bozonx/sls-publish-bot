import TgChat from '../../apiTg/TgChat.js';
import {startPublishPollTg} from '../startPublishPollTg.js';
import {askCustomTgPostMainMenu, CUSTOM_POST_MENU_ACTIONS} from './askCustomTgPostMainMenu.js';
import {startPublishCustomPostTg} from './startPublishCustomPostTg.js';


export async function startCustomTgPostMenu(blogName: string, tgChat: TgChat) {
  await askCustomTgPostMainMenu(blogName, tgChat, tgChat.asyncCb(async (action: string) => {
    if (action === CUSTOM_POST_MENU_ACTIONS.POST1000) {
      const footer = tgChat.app.blogs[blogName].sn.telegram?.postFooter;

      // await startPublishCustomPostTg(blogName, tgChat, footer);
    }
    else if (action === CUSTOM_POST_MENU_ACTIONS.POST2000) {
      const footer = tgChat.app.blogs[blogName].sn.telegram?.postFooter;

      // await startPublishCustomPostTg(blogName, tgChat, footer);
    }
    else if (action === CUSTOM_POST_MENU_ACTIONS.PHOTOS) {
      const footer = tgChat.app.blogs[blogName].sn.telegram?.postFooter;

      // await startPublishCustomPostTg(blogName, tgChat, footer);
    }
    else if (action === CUSTOM_POST_MENU_ACTIONS.MEM) {
      const footer = tgChat.app.blogs[blogName].sn.telegram?.memFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer, true);
    }
    else if (action === CUSTOM_POST_MENU_ACTIONS.STORY) {
      const footer = tgChat.app.blogs[blogName].sn.telegram?.storyFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer, true, true);
    }
    else if (action === CUSTOM_POST_MENU_ACTIONS.REEL) {
      const footer = tgChat.app.blogs[blogName].sn.telegram?.reelFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer, true, true);
    }
    else if (action === CUSTOM_POST_MENU_ACTIONS.POLL) {
      await startPublishPollTg(blogName, tgChat);
    }
  }));
}
