import TgChat from '../apiTg/TgChat.js';
import {askCost} from './common/askCost.js';
import {AdFormat, CurrencyTicker, SellAdType} from '../types/types.js';
import {askFormat} from './common/askFormat.js';
import {askCustomPostTg} from './customPost/askCustomPostTg.js';
import {CustomPostState} from './customPost/askCustomPostMenu.js';
import {askNote} from './common/askNote.js';
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints.js';
import {askSellAdType} from './askSellAdType.js';
import {askDateTime} from './common/askDateTime.js';
import {registerCustomPostTg} from './customPost/startPublishCustomPostTg.js';


const SELL_AD_TYPE_IDS: Record<SellAdType, string> = {
  publish_post: 'nbiD',
  recommend: 'dgBa',
  other: 'a=W|',
};

const SELL_AD_FORMAT_IDS: Record<AdFormat, string> = {
  '1/24': 'UkwQ',
  '1/48': 'QkT=',
  '2/24': 'kXXI',
  '2/48': 'z=|H',
  '2/72': 'w}Ib',
  '3/24': 'aajz',
  '3/48': 'q]j}',
  '3/72': 'FVNf',
  'full/24': '@vMb',
  'full/48': 'IEWl',
  'full/72': 'ccLt',
  forever: 'Jw}Z',
};


export async function startSellAd(blogName: string, tgChat: TgChat) {
  await askCustomPostTg(
    blogName,
    tgChat,
    tgChat.asyncCb(async (
      state: CustomPostState,
      resultText: string,
      isPost2000: boolean,
    ) => {
      await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
        await askCost(tgChat, tgChat.asyncCb(async (cost: number | undefined, currency: CurrencyTicker) => {
          await askFormat(tgChat, tgChat.asyncCb(async (format: AdFormat) => {
            const formatId: string = SELL_AD_FORMAT_IDS[format];

            await askSellAdType(tgChat, tgChat.asyncCb(async (adType: SellAdType) => {
              const adTypeId: string = SELL_AD_TYPE_IDS[adType];

              // TODO: ask вп если не было введено цены ???

              await askNote(tgChat, tgChat.asyncCb(async (note: string) => {
                await registerCustomPostTg(
                  blogName,
                  tgChat,
                  isoDate,
                  time,
                  resultText,
                  isPost2000,
                  state.usePreview,
                  state.mediaGroup,
                  state.urlBtn,
                  state.autoDeleteIsoDateTime
                );

                const request: CreatePageParameters = {
                  parent: { database_id: tgChat.app.blogs[blogName].notion.sellTgDbId },
                  properties: {
                    date: {
                      type: 'date',
                      date: {
                        start: isoDate
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

                    //is_collab: { id: 'jh%3Dp', name: 'is_collab', type: 'checkbox', checkbox: {} },

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

                await tgChat.reply(tgChat.app.i18n.message.sellAdDone);
                await tgChat.steps.cancel();
              }));

            }));
          }));
        }));
      }));
    }),
    undefined,
    undefined,
    undefined,
    true,
  );
}
