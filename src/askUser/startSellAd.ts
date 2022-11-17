import TgChat from '../apiTg/TgChat';
import {askCost} from './askCost';
import {AdFormat, BuyAdType, CurrencyTicker, SellAdType} from '../types/types';
import {askFormat} from './askFormat';
import {askCustomPostTg} from './askCustomPostTg';
import {CustomPostState} from './askCustomPostMenu';
import {askNote} from './askNote';
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints';


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
      // TODO: а как это использовать ???
      disableOk: boolean
    ) => {
      // TODO: ask cost - добавить - ничего не выбранно
      await askCost(tgChat, tgChat.asyncCb(async (cost: number | undefined, currency: CurrencyTicker) => {
        await askFormat(tgChat, tgChat.asyncCb(async (format: AdFormat) => {
          const formatId: string = SELL_AD_FORMAT_IDS[format];

          // TODO: sell ad type
          // TODO: ask вп ???

          await askNote(tgChat, tgChat.asyncCb(async (note: string) => {

            // TODO: зарегистрировать таск

            const request: CreatePageParameters = {
              parent: { database_id: tgChat.app.config.blogs[blogName].notionSellTgDbId },
              properties: {
                date: {
                  type: 'date',
                  date: {
                    start: state.selectedDate!
                  },
                },
                time: {
                  type: 'rich_text',
                  rich_text: [{
                    type: 'text',
                    text: {
                      content: state.selectedTime!
                    },
                  }],
                },
                //is_collab: { id: 'jh%3Dp', name: 'is_collab', type: 'checkbox', checkbox: {} },

                // ad_type: {
                //   type: 'select',
                //   select: {
                //     id: adTypeId,
                //   }
                // },
                format: {
                  type: 'select',
                  select: {
                    id: formatId,
                  }
                },
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
    }),
    undefined,
    undefined,
    undefined,
    true,
  );
}
