import TgChat from '../apiTg/TgChat';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK, OFTEN_USED_TIME,
} from '../types/constants';
import BaseState from '../types/BaseState';
import _ from 'lodash';
import {TextMessageEvent} from '../types/MessageEvent';
import {breakArray} from '../lib/arrays';
import {TgReplyButton} from '../types/TgReplyButton';
import {validateTime} from '../lib/common';


//const TIME_PRESET_CB = 'TIME_PRESET_CB|'


export async function askUrlButton(tgChat: TgChat, onDone: (time: string) => void) {
  const msg = tgChat.app.i18n.commonPhrases.typeBtnText;
  const buttons = [
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
