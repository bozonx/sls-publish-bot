import TgChat from '../apiTg/TgChat.js';
import {startPublishFromContentPlan} from './publishContentPlan/startPublishFromContentPlan.js';
import {askBlogMenu, BLOG_MENU_ACTIONS} from './askBlogMenu.js';
import {startSellAd} from './adTg/startSellAd.js';
import {startBuyAd} from './adTg/startBuyAd.js';
import {startCustomTgPostTypeMenu} from './customTgPost/startCustomTgPostTypeMenu.js';


export async function startBlogMenu(blogName: string, tgChat: TgChat) {
  await askBlogMenu(blogName, tgChat, tgChat.asyncCb(async (action: string) => {
    switch (action) {
      case BLOG_MENU_ACTIONS.CONTENT_PLAN:
        return await startPublishFromContentPlan(blogName, tgChat);
      case BLOG_MENU_ACTIONS.CUSTOM_TG_POST:
        return await startCustomTgPostTypeMenu(blogName, tgChat);
      case BLOG_MENU_ACTIONS.BUY_TG_AD:
        return await startBuyAd(blogName, tgChat);
      case BLOG_MENU_ACTIONS.SELL_TG_AD_PLACE:
        return await startSellAd(blogName, tgChat);
      default:
        throw new Error(`Unknown action ${action}`)
    }
  }));
}
