import TgChat from '../../apiTg/TgChat';
import {askCost} from '../common/askCost';
import {AD_FORMATS, AD_SELL_TYPES, CurrencyTicker} from '../../types/types';
import {askFormat} from '../common/askFormat';
import {askCustomPostTg, CustomPostState} from '../customTgPost/askCustomPostTg';
import {askNote} from '../common/askNote';
import {askSellAdType} from './askSellAdType';
import {askDateTime} from '../common/askDateTime';
import {createSellAdItem} from '../../notionRequests/createSellAdItem';
import {askText} from '../common/askText';
import {askAdBuyer} from './askAdBuyer';
import moment from 'moment';
import {makeIsoDateTimeStr} from '../../helpers/helpers';
import {WARN_SIGN} from '../../types/constants';


export async function startSellAd(blogName: string, tgChat: TgChat) {
  await askFormat(tgChat, tgChat.asyncCb(async (format: keyof typeof AD_FORMATS) => {
    const splat = format.split('/')
    const autoDeletePeriod = Number(splat[1])

    if (Number.isInteger(autoDeletePeriod)) {
      await tgChat.reply(tgChat.app.i18n.message.selectedAutoDeletePeriod + autoDeletePeriod)
    }

    await askCustomPostTg(
      blogName,
      tgChat,
      tgChat.asyncCb(async (state: CustomPostState, resultTextHtml: string) => {
        await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
          // validate that selected date is greater than auto-delete date
          if (
            state.autoDeleteTgIsoDateTime && moment(state.autoDeleteTgIsoDateTime).unix()
            <= moment(makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)).unix()
          ) {
            await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

            return
          }

          await askCost(tgChat, tgChat.asyncCb(async (cost: number | undefined, currency: CurrencyTicker) => {
            await askSellAdType(tgChat, tgChat.asyncCb(async (adType: keyof typeof AD_SELL_TYPES) => {
              await askAdBuyer(tgChat, tgChat.asyncCb(async (buyerHtml?: string) => {
                await askText(tgChat, tgChat.asyncCb(async (contactHtml?: string) => {
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
                        state.autoDeletePeriodHours,
                        cost,
                        note,
                        contactHtml,
                        buyerHtml
                      )
                    }
                    catch (e) {
                      await tgChat.reply(tgChat.app.i18n.errors.cantCreatePage + e)

                      return
                    }

                    await tgChat.reply(tgChat.app.i18n.message.sellAdDone);
                    await tgChat.steps.cancel();
                  }))
                }), tgChat.app.i18n.menu.adContact, true, tgChat.app.i18n.commonPhrases.skip)
              }))
            }))
          }))
        }), undefined, undefined, true, true);
      }),
      undefined,
      undefined,
      false,
      true,
      true,
      (Number.isInteger(autoDeletePeriod)) ? autoDeletePeriod : undefined
    )
  }))
}
