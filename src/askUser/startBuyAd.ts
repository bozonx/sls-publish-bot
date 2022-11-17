import TgChat from '../apiTg/TgChat';
import {askCreative} from './askCreative';
import {CreatePageParameters, PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {askDate} from './askDate';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {askTime} from './askTime';
import {askCost} from './askCost';
import {BuyAdType, CurrencyTicker} from '../types/types';
import {askFormat} from './askFormat';


const AD_BUY_TYPE_IDS: Record<BuyAdType, string> = {
  best_articles: 'ZpdT',
  question_solve: 'Th{s',
  advert: '?QvM',
  recommend: 'h{Sb',
};


export async function startBuyAd(blogName: string, tgChat: TgChat) {
  await askCreative(blogName, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    await askDate(tgChat, tgChat.asyncCb(async (isoDate: string) => {
      const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);

      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedOnlyDate
        + `${isoDate} ${utcOffset}`
      );

      await askTime(tgChat, tgChat.asyncCb(async (time: string) => {
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

            await tgChat.reply(tgChat.app.i18n.message.buyAdDone);
            await tgChat.steps.cancel();
          }));
        }));
      }));
    }));
  }));
}
