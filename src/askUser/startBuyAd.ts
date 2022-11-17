import TgChat from '../apiTg/TgChat';
import {askCreative} from './askCreative';
import {CreatePageParameters, PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {askDate} from './askDate';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {askTime} from './askTime';
import {askCost} from './askCost';
import {AdFormat, BuyAdType, CurrencyTicker} from '../types/types';
import {askFormat} from './askFormat';
import {askNote} from './askNote';
import {askBuyAdType} from './askBuyAdType';


const AD_BUY_TYPE_IDS: Record<BuyAdType, string> = {
  best_articles: 'ZpdT',
  question_solve: 'Th{s',
  advert: '?QvM',
  recommend: 'h{Sb',
};

const AD_FORMAT_IDS: Record<AdFormat, string> = {
  '1/24': 'CYmi',
  '1/48': 'oR::',
  '2/24': 'Ngws',
  '2/48': 'N[vW',
  '2/72': 'd?iO',
  '3/24': 'I}Um',
  '3/48': 'ZPsl',
  '3/72': 'gSsX',
  'full/24': ']?}Y',
  'full/48': 'v?mt',
  'full/72': 'Iov}',
  forever: 'CX}m',
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

        // TODO: ask channel

        await askCost(tgChat, tgChat.asyncCb(async (cost: number, currency: CurrencyTicker) => {
          await askFormat(tgChat, tgChat.asyncCb(async (format: AdFormat) => {
            const formatId: string = AD_FORMAT_IDS[format];

            await askBuyAdType(tgChat, tgChat.asyncCb(async (adType: BuyAdType) => {
              const adTypeId: string = AD_BUY_TYPE_IDS[adType];

              await tgChat.reply(tgChat.app.i18n.message.noteOrDone);

              await askNote(tgChat, tgChat.asyncCb(async (note: string) => {
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
                        id: adTypeId,
                      }
                    },
                    format: {
                      type: 'select',
                      select: {
                        id: formatId,
                      }
                    },
                    note: {
                      type: 'title',
                      title: [{
                        text: {
                          content: note,
                        },
                      }],
                    },

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
    }));
  }));
}
