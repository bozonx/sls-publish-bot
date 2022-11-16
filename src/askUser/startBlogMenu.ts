import TgChat from '../apiTg/TgChat';
import {startPublishFromContentPlan} from '../publish/startPublishFromContentPlan';
import {startPublishCustomPostTg} from '../publish/startPublishCustomPostTg';
import {startPublishPollTg} from '../publish/startPublishPollTg';
import {askBlogMenu, BLOG_MENU_ACTIONS} from './askBlogMenu';
import {startRegisterAdPlaceSell} from './startRegisterAdPlaceSell';
import {askCreative} from './askCreative';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {askPubDate} from './askPubDate';
import {askSelectTime} from './askSelectTime';
import {askCost} from './askCost';
import {CurrencyTicker} from '../types/types';
import {makeUtcOffsetStr} from '../helpers/helpers';


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
      await askCreative(blogName, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
        await askPubDate(tgChat, tgChat.asyncCb(async (isoDate: string) => {
          const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);

          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.selectedOnlyDate
            + `${isoDate} ${utcOffset}`
          );

          await askSelectTime(tgChat, tgChat.asyncCb(async (time: string) => {
            await tgChat.reply(
              tgChat.app.i18n.commonPhrases.pubDate
              + `${isoDate} ${time} ${utcOffset}`
            );

            // TODO: ask channel to publish
            await askCost(tgChat, tgChat.asyncCb(async (cost: number, currency: CurrencyTicker) => {
              console.log(1111, item, isoDate, time, cost, currency)
              // TODO: type 1/24 etc - если выбран custom - то указать время удаления
              // TODO: register buying - add item to creatives table
            }));
          }));
        }));
      }));
    }
    else if (action === BLOG_MENU_ACTIONS.SELL_AD_PLACE) {
      await startPublishCustomPostTg(blogName, tgChat, undefined, undefined, undefined, true);
      // TODO: register selling place - ask date, time, cost (или вп), type 1/24 etc (или другое время удаления)
      await startRegisterAdPlaceSell(blogName, tgChat);
    }
  }));
}
