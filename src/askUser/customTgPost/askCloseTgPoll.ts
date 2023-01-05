import _ from 'lodash';
import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK, WARN_SIGN,
} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {TextMessageEvent} from '../../types/MessageEvent.js';
import {breakArray} from '../../lib/arrays.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {askDateTime} from '../common/askDateTime.js';
import {makeIsoDateTimeStr} from '../../helpers/helpers.js';


const POLL_CLOSE_MENU_ACTION = {
  hours: 'hours|',
  skip: 'skip',
  setDate: 'setDate',
};

const POLL_CLOSE_MENU_PRESET = {
  '1 сутки': 24,
  '2 суток': 48,
  '3 суток': 72,
  '7 суток': 168,
};


export async function askCloseTgPoll(publishIsoDateTime: string, tgChat: TgChat, onDone: (closeIsoDateTime?: string) => void) {
  const msg = tgChat.app.i18n.menu.selectPollClose;
  const buttons = [
    ...breakArray(Object.keys(POLL_CLOSE_MENU_PRESET).map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: POLL_CLOSE_MENU_ACTION.hours + (POLL_CLOSE_MENU_PRESET as any)[el],
      }
    }), 2),
    [
      {
        text: tgChat.app.i18n.commonPhrases.setDate,
        callback_data: POLL_CLOSE_MENU_ACTION.setDate,
      }
    ],
    [
      BACK_BTN,
      CANCEL_BTN,
      {
        text: tgChat.app.i18n.commonPhrases.skip,
        callback_data: POLL_CLOSE_MENU_ACTION.skip,
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
          else if (queryData === POLL_CLOSE_MENU_ACTION.skip) {
            return onDone();
          }
          else if (queryData === POLL_CLOSE_MENU_ACTION.setDate) {
            await askDateTime(tgChat, (isoDate: string, time: string) => {
              onDone(makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset))
            });
          }
          else if (queryData.indexOf(POLL_CLOSE_MENU_ACTION.hours) === 0) {
            const splat = queryData.split('|');

            onDone(resolveDateByHours(publishIsoDateTime, Number(splat[1])));
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

          onDone(resolveDateByHours(publishIsoDateTime, hours));
        })
      ),
      ChatEvents.TEXT
    ]);
  });

}


function resolveDateByHours(publishIsoDateTime: string, hours: number): string {
  return moment(publishIsoDateTime)
    .add(hours, 'hours')
    .format()
}
