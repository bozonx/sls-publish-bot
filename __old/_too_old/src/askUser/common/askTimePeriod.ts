import _ from 'lodash'
import TgChat from '../../apiTg/TgChat'
import {ChatEvents, WARN_SIGN} from '../../types/constants'
import BaseState from '../../types/BaseState'
import {TextMessageEvent} from '../../../../microserviceTelegramBot/src/types/MessageEvent.js'
import {breakArray} from '../../lib/arrays'
import {TgReplyButton} from '../../types/TgReplyButton'
import {askDateTime} from './askDateTime'
import {makeIsoDateTimeStr} from '../../helpers/helpers'
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons';


const PERIOD_MENU_ACTION = {
  hours: 'hours|',
  skip: 'skip',
  setDate: 'setDate',
};

const PERIOD_MENU_PRESET = {
  '1 сутки': 24,
  '2 суток': 48,
  '3 суток': 72,
  '7 суток': 168,
};


export async function askTimePeriod(tgChat: TgChat, onDone: (
  hoursPeriod?: number,
  certainIsoDateTime?: string
) => void, stepName?: string, skipBtnText?: string) {
  // TODO: change msg
  const msg = tgChat.app.i18n.menu.selectPollClose;
  const buttons = [
    ...breakArray(Object.keys(PERIOD_MENU_PRESET).map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: PERIOD_MENU_ACTION.hours + (PERIOD_MENU_PRESET as any)[el],
      }
    }), 2),
    [
      {
        text: tgChat.app.i18n.commonPhrases.setDate,
        callback_data: PERIOD_MENU_ACTION.setDate,
      }
    ],
    [
      makeBackBtn(tgChat.app.i18n),
      makeCancelBtn(tgChat.app.i18n),
      {
        text: skipBtnText || tgChat.app.i18n.commonPhrases.skip,
        callback_data: PERIOD_MENU_ACTION.skip,
      }
    ],
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
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
          else if (queryData === PERIOD_MENU_ACTION.skip) {
            return onDone();
          }
          else if (queryData === PERIOD_MENU_ACTION.setDate) {
            // set certain date
            await askDateTime(tgChat, (isoDate: string, time: string) => {
              onDone(undefined, makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset))
            }, undefined, undefined, true, true)
          }
          else if (queryData.indexOf(PERIOD_MENU_ACTION.hours) === 0) {
            const splat = queryData.split('|');

            onDone(Number(splat[1]));
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (message: TextMessageEvent) => {
          const hours = Number(_.trim(message.text));

          if (Number.isNaN(hours)) {
            await tgChat.reply(WARN_SIGN + ' ' + tgChat.app.i18n.errors.invalidNumber)

            return;
          }

          onDone(hours);
        })
      ),
      ChatEvents.TEXT
    ]);
  }, undefined, stepName);

}
