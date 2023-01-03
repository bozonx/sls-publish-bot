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
import {breakArray} from '../lib/arrays.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import {validateTime} from '../lib/common.js';


const TIME_PRESET_CB = 'TIME_PRESET_CB|'


export async function askTime(tgChat: TgChat, onDone: (time: string) => void) {
  const msg = tgChat.app.i18n.menu.selectTime;
  const buttons = [
    ...breakArray(OFTEN_USED_TIME.map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: TIME_PRESET_CB + el,
      };
    }), 4),
    [
      BACK_BTN,
      CANCEL_BTN
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
          else if (queryData.indexOf(TIME_PRESET_CB) === 0) {
            const splat = queryData.split('|');

            onDone(splat[1]);
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (message: TextMessageEvent) => {
          const trimmed = _.trim(message.text);

          if (trimmed.match(/^\d{1,2}$/)) {
            if (Number(trimmed) < 1 || Number(trimmed) > 23) {
              await tgChat.reply(tgChat.app.i18n.errors.incorrectTime);

              return;
            }

            // only hour
            return onDone(((trimmed.length === 1) ? `0${trimmed}` : trimmed) + ':00');
          }

          try {
            validateTime(trimmed);
          }
          catch (e) {
            await tgChat.reply(tgChat.app.i18n.errors.incorrectTime);

            return;
          }

          onDone(trimmed);
        })
      ),
      ChatEvents.TEXT
    ]);
  });

}
