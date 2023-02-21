import {CreatePageParameters, PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import TgChat from '../../apiTg/TgChat.js';
import {askCreative} from './askCreative.js';
import {askCost} from '../common/askCost.js';
import {AD_BUY_TYPES, AD_FORMATS, CurrencyTicker} from '../../types/types.js';
import {askFormat} from '../common/askFormat.js';
import {askNote} from '../common/askNote.js';
import {askBuyAdType} from './askBuyAdType.js';
import {askDateTime} from '../common/askDateTime.js';
import {requestPageBlocks} from '../../apiNotion/requestPageBlocks.js';
import {printCreative} from '../../tgAdvertHelpers/printCreative.js';


// TODO: это нафига???
const BUY_AD_TYPE_IDS: Record<keyof typeof AD_BUY_TYPES, string> = {
  bestArticles: 'ZpdT',
  questionSolve: 'Th{s',
  advert: '?QvM',
  recommend: 'h{Sb',
};

// TODO: это нафига???
const BUY_AD_FORMAT_IDS: Record<keyof typeof AD_FORMATS, string> = {
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
    const pageContent = await requestPageBlocks(item.id, tgChat.app.notion);

    await printCreative(tgChat, item, pageContent)

    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {

      // TODO: ask channel - в какой канал публиковать

      await askCost(tgChat, tgChat.asyncCb(async (cost: number | undefined, currency: CurrencyTicker) => {
        await askFormat(tgChat, tgChat.asyncCb(async (format: keyof typeof AD_FORMATS) => {

          // TODO: вместо этого выгрузить данные из notion

          const formatId: string = BUY_AD_FORMAT_IDS[format]

          await askBuyAdType(tgChat, tgChat.asyncCb(async (adType: keyof typeof AD_BUY_TYPES) => {

            // TODO: вместо этого выгрузить данные из notion

            const adTypeId: string = BUY_AD_TYPE_IDS[adType];

            await tgChat.reply(tgChat.app.i18n.message.noteOrDone)

            await askNote(tgChat, tgChat.asyncCb(async (note: string) => {

              // TODO: перенести в отдельный файл

              const request: CreatePageParameters = {
                parent: { database_id: tgChat.app.blogs[blogName].notion.buyTgDbId },
                properties: {
                  date: {
                    type: 'date',
                    date: {
                      start: isoDate,
                    },
                  },
                  time: {
                    type: 'rich_text',
                    rich_text: [{
                      type: 'text',
                      text: {
                        content: time
                      },
                    }],
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
              };

              if (typeof cost !== 'undefined') {
                request.properties.price_rub = {
                  type: 'number',
                    number: cost,
                };
              }

              if (note) {
                request.properties.note = {
                  type: 'title',
                  title: [{
                    text: {
                      content: note,
                    },
                  }],
                };
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
    }), undefined, undefined, true, true);
  }));
}
