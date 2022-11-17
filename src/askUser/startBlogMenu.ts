import TgChat from '../apiTg/TgChat';
import {startPublishFromContentPlan} from '../publish/startPublishFromContentPlan';
import {startPublishCustomPostTg} from '../publish/startPublishCustomPostTg';
import {startPublishPollTg} from '../publish/startPublishPollTg';
import {askBlogMenu, BLOG_MENU_ACTIONS} from './askBlogMenu';
import {startRegisterAdPlaceSell} from './startRegisterAdPlaceSell';
import {askCreative} from './askCreative';
import {CreatePageParameters, PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {askPubDate} from './askPubDate';
import {askSelectTime} from './askSelectTime';
import {askCost} from './askCost';
import {BuyAdType, CurrencyTicker} from '../types/types';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {askFormat} from './askFormat';


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
      await buyAd(blogName, tgChat);
    }
    else if (action === BLOG_MENU_ACTIONS.SELL_AD_PLACE) {
      await startPublishCustomPostTg(blogName, tgChat, undefined, undefined, undefined, true);
      // TODO: register selling place - ask date, time, cost (или вп), type 1/24 etc (или другое время удаления)
      await startRegisterAdPlaceSell(blogName, tgChat);
    }
  }));
}


/*
    { id: 'LQH}', name: '20:00', color: 'default' },
    { id: '=fEc', name: '19:30', color: 'default' },
    { id: 'sz|~', name: '19:00', color: 'default' },
    { id: '\\cp{', name: '18:30', color: 'default' },
    { id: '}Uek', name: '18:00', color: 'gray' },
    { id: 'GNDx', name: '17:00', color: 'default' },
    { id: ';vUr', name: '16:00', color: 'default' },
    { id: 'mMGy', name: '13:00', color: 'default' },
    { id: 'waiP', name: '11:00', color: 'default' },
    { id: 'vyfj', name: '10:30', color: 'default' },
    { id: '};Gq', name: '10:00', color: 'gray' },
    { id: 'h<m?', name: '8:00', color: 'default' },
    {
      id: '7978881f-f5c1-4598-baa6-5c2f0f8697e5',
      name: '15:00',
      color: 'brown'
    }

 */

const AD_BUY_TYPE_IDS: Record<BuyAdType, string> = {
  best_articles: 'ZpdT',
  question_solve: 'Th{s',
  advert: '?QvM',
  recommend: 'h{Sb',
};

async function buyAd(blogName: string, tgChat: TgChat) {
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

        await askCost(tgChat, tgChat.asyncCb(async (cost: number, currency: CurrencyTicker) => {
          await askFormat(tgChat, tgChat.asyncCb(async (format: string) => {

            // TODO: ask ad type

            // TODO: ask confirm - and asn note

            const request: CreatePageParameters = {
              parent: { database_id: tgChat.app.config.blogs['test'].notionBuyTgDbId },
              properties: {
                date: {
                  type: 'date',
                  date: {
                    start: isoDate,
                  },
                },
                time_str: {
                  type: 'rich_text',
                  rich_text: [{
                    type: 'text',
                    text: {
                      content: time
                    },
                  }],
                },
                price_rub: {
                  type: 'number',
                  number: cost,
                },
                ad_type: {
                  type: 'select',
                  select: {
                    id: AD_BUY_TYPE_IDS.best_articles,
                  }
                },

                // time: {
                //   type: 'select',
                //   select: {
                //     // TODO: add id
                //     name: time,
                //   }
                // },

                // channel: {
                //   type: 'rich_text',
                //   rich_text: [{
                //     type: 'text',
                //     text: {
                //       content: 'some channel',
                //       link: { url: 'https://ya.ru' },
                //     },
                //   }],
                // },
                // note: {
                //   type: 'title',
                //   title: [{
                //     text: {
                //       content: 'some text',
                //     },
                //   }],
                // },
              },
            }

            try {
              const result = await tgChat.app.notion.api.pages.create(request);

              if (!result.id) throw new Error(`No result id`);
            }
            catch (e) {
              await tgChat.reply(tgChat.app.i18n.errors.cantCreatePage + e)
            }
          }));
        }));
      }));
    }));
  }));
}
