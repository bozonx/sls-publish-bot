import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import TgChat from '../../apiTg/TgChat';
import {askCreative} from './askCreative';
import {askCost} from '../common/askCost';
import {AD_BUY_TYPES, AD_FORMATS, CurrencyTicker} from '../../types/types';
import {askFormat} from '../common/askFormat';
import {askNote} from '../common/askNote';
import {askBuyAdType} from './askBuyAdType';
import {askDateTime} from '../common/askDateTime';
import {requestPageBlocks} from '../../apiNotion/requestPageBlocks';
import {printCreative} from '../../tgAdvertHelpers/printCreative';
import {createBuyAdItem} from '../../notionRequests/createBuyAdItem';
import {askTgChannel} from '../common/askTgChannel';


export async function startBuyAd(blogName: string, tgChat: TgChat) {
  await askCreative(blogName, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    const pageContent = await requestPageBlocks(item.id, tgChat.app.notion);

    await printCreative(tgChat, item, pageContent)

    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      await askTgChannel(tgChat, tgChat.asyncCb(async (channelName?: string, channelUrl?: string) => {
        await askCost(tgChat, tgChat.asyncCb(async (cost: number | undefined, currency: CurrencyTicker) => {
          await askFormat(tgChat, tgChat.asyncCb(async (format: keyof typeof AD_FORMATS) => {
            await askBuyAdType(tgChat, tgChat.asyncCb(async (adType: keyof typeof AD_BUY_TYPES) => {
              await tgChat.reply(tgChat.app.i18n.message.noteOrDone)

              await askNote(tgChat, tgChat.asyncCb(async (note: string) => {
                try {
                  await createBuyAdItem(
                    blogName,
                    tgChat,
                    isoDate,
                    time,
                    adType,
                    format,
                    channelName,
                    channelUrl,
                    cost,
                    note
                  )
                }
                catch (e) {
                  await tgChat.reply(tgChat.app.i18n.errors.cantCreatePage + e)

                  return
                }

                await tgChat.reply(tgChat.app.i18n.message.buyAdDone)
                await tgChat.steps.cancel();
              }))

            }));
          }));
        }))
      }))
    }), undefined, undefined, true, true);
  }));
}
