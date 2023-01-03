import _ from 'lodash';
import TgChat from '../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK, OFTEN_USED_TIME,
} from '../types/constants.js';
import BaseState from '../types/BaseState.js';
import {TextMessageEvent} from '../types/MessageEvent.js';
import {CURRENCY_TICKERS, CurrencyTicker} from '../types/types.js';


//export const ASK_COST_CURRENCY = 'ASK_COST_CURRENCY:';
export const NO_COST_CURRENCY = 'NO_COST_CURRENCY:';


export async function askCost(tgChat: TgChat, onDone: (cost: number | undefined, currency: CurrencyTicker) => void) {
  const msg = tgChat.app.i18n.menu.inputCost;
  const buttons = [
    [
      {
        text: tgChat.app.i18n.commonPhrases.skip,
        callback_data: NO_COST_CURRENCY,
      },
      // {
      //   text: CURRENCY_TICKERS.RUB,
      //   callback_data: ASK_COST_CURRENCY + CURRENCY_TICKERS.RUB,
      // },
    ],
    [
      BACK_BTN,
      CANCEL_BTN
    ],
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    const currency = CURRENCY_TICKERS.RUB;
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          else if (queryData === NO_COST_CURRENCY) {
            onDone(undefined, currency);
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (message: TextMessageEvent) => {
          const num = Number(_.trim(message.text));

          if (Number.isNaN(num)) {
            await tgChat.reply(tgChat.app.i18n.errors.invalidNumber);

            return;
          }

          await tgChat.reply(tgChat.app.i18n.message.costResult + num + ' ' + currency);

          onDone(num, currency);
        })
      ),
      ChatEvents.TEXT
    ]);
  });

}
