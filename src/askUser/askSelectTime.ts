import TgChat from '../apiTg/TgChat';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK, OFTEN_USED_TIME,
} from '../types/constants';
import BaseState from '../types/BaseState';
import _ from 'lodash';
import {validateTime} from '../helpers/helpers';
import {TextMessageEvent} from '../types/MessageEvent';
import {breakArray} from '../lib/arrays';
import TgReplyButton from '../types/TgReplyButton';


const TIME_PRESET_CB = 'TIME_PRESET_CB|'


export async function askSelectTime(tgChat: TgChat, onDone: (time: string) => void) {
  const msg = tgChat.app.i18n.menu.selectTime;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN
    ],
    ...breakArray(OFTEN_USED_TIME.map((el): TgReplyButton => {
      return {
        text: el,
        callback_data: TIME_PRESET_CB + el,
      };
    }), 4),
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
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
      AppEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.TEXT,
        tgChat.asyncCb(async (message: TextMessageEvent) => {
          const trimmed = _.trim(message.text);

          if (trimmed.match(/^\d{1,2}$/)) {
            // only hour
            return onDone((trimmed.length === 1) ? `0${trimmed}` : trimmed + ':00');
          }

          try {
            validateTime(trimmed);
          }
          catch (e) {
            await tgChat.reply(tgChat.app.i18n.errors.incorrectTime)

            return;
          }

          onDone(trimmed);
        })
      ),
      AppEvents.TEXT
    ]);
  });

}
