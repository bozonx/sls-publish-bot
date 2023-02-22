import TgChat from '../../apiTg/TgChat.js';
import {askCost} from '../common/askCost.js';
import {AD_FORMATS, AD_SELL_TYPES, CurrencyTicker} from '../../types/types.js';
import {askFormat} from '../common/askFormat.js';
import {askCustomPostTg, CustomPostState} from '../customTgPost/askCustomPostTg.js';
import {askNote} from '../common/askNote.js';
import {askSellAdType} from './askSellAdType.js';
import {askDateTime} from '../common/askDateTime.js';
import {createSellAdItem} from '../../notionRequests/createSellAdItem.js';


export async function startSellAd(blogName: string, tgChat: TgChat) {

  // TODO: это может быть и текст и 1 картинка или видео
  // TODO: спросить покупателя

  await askCustomPostTg(
    blogName,
    tgChat,
    tgChat.asyncCb(async (state: CustomPostState, resultTextHtml: string) => {
      await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
        await askCost(tgChat, tgChat.asyncCb(async (cost: number | undefined, currency: CurrencyTicker) => {
          await askFormat(tgChat, tgChat.asyncCb(async (format: keyof typeof AD_FORMATS) => {
            await askSellAdType(tgChat, tgChat.asyncCb(async (adType: keyof typeof AD_SELL_TYPES) => {

              // TODO: ask вп если не было введено цены ???

              await askNote(tgChat, tgChat.asyncCb(async (note: string) => {
                try {
                  await createSellAdItem(
                    blogName,
                    tgChat,
                    isoDate,
                    time,
                    state.usePreview,
                    state.mediaGroup,
                    resultTextHtml,
                    format,
                    adType,
                    state.tgUrlBtn,
                    state.autoDeleteTgIsoDateTime,
                    cost,
                    note
                  )
                }
                catch (e) {
                  await tgChat.reply(tgChat.app.i18n.errors.cantCreatePage + e)

                  return
                }

                await tgChat.reply(tgChat.app.i18n.message.sellAdDone);
                await tgChat.steps.cancel();
              }));

            }));
          }));
        }));
      }), undefined, undefined, true, true);
    }),
    false,
    undefined,
    true,
    true,
    true,
  );
}
