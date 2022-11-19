import TgChat from '../apiTg/TgChat';
import {startPublishFromContentPlan} from './startPublishFromContentPlan';
import {startPublishCustomPostTg} from './startPublishCustomPostTg';
import {startPublishPollTg} from './startPublishPollTg';
import {askBlogMenu, BLOG_MENU_ACTIONS} from './askBlogMenu';
import {startSellAd} from './startSellAd';
import {startBuyAd} from './startBuyAd';


export async function startBlogMenu(blogName: string, tgChat: TgChat) {
  await askBlogMenu(blogName, tgChat, tgChat.asyncCb(async (action: string) => {
    if (action === BLOG_MENU_ACTIONS.CONTENT_PLAN) {
      await startPublishFromContentPlan(blogName, tgChat);
    }
    else if (action === BLOG_MENU_ACTIONS.STORY) {
      const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer, true, true);
    }
    else if (action === BLOG_MENU_ACTIONS.MEM) {
      const footer = tgChat.app.config.blogs[blogName].sn.telegram?.memFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer, true);
    }
    else if (action === BLOG_MENU_ACTIONS.REEL) {
      const footer = tgChat.app.config.blogs[blogName].sn.telegram?.reelFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer, true, true);
    }
    else if (action === BLOG_MENU_ACTIONS.POLL) {
      await startPublishPollTg(blogName, tgChat);
    }
    else if (action === BLOG_MENU_ACTIONS.POST) {
      const footer = tgChat.app.config.blogs[blogName].sn.telegram?.postFooter;

      await startPublishCustomPostTg(blogName, tgChat, footer);
    }
    else if (action === BLOG_MENU_ACTIONS.BUY_AD) {
      await startBuyAd(blogName, tgChat);
    }
    else if (action === BLOG_MENU_ACTIONS.SELL_AD_PLACE) {
      await startSellAd(blogName, tgChat);
    }
  }));
}
