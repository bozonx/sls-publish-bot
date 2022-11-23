import TgChat from '../apiTg/TgChat';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import BaseState from '../types/BaseState';
import _ from 'lodash';
import {TextMessageEvent} from '../types/MessageEvent';
import {breakArray} from '../lib/arrays';
import {TgReplyButton} from '../types/TgReplyButton';
import {validateTime} from '../lib/common';


const POLL_CLOSE_MENU_ACTION = {
  hours: 'hours|',
  skip: 'skip',
};

const POLL_CLOSE_MENU_PRESET = {
  '1 сутки': 24,
  '2 суток': 48,
  '3 суток': 72,
  '7 суток': 168,
};


export async function askClosePoll(tgChat: TgChat, onDone: (closeIsoDateTime: string) => void) {
  const msg = tgChat.app.i18n.menu.selectPollClose;
  const buttons = [
    ...breakArray(Object.keys(POLL_CLOSE_MENU_PRESET).map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: POLL_CLOSE_MENU_ACTION.hours + (POLL_CLOSE_MENU_PRESET as any)[el],
      }
    }), 2),
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
          // else if (queryData.indexOf(TIME_PRESET_CB) === 0) {
          //   const splat = queryData.split('|');
          //
          //   onDone(splat[1]);
          // }
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
