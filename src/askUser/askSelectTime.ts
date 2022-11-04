import TgChat from '../apiTg/TgChat';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import BaseState from '../types/BaseState';
import _ from 'lodash';
import {validateTime} from '../helpers/helpers';


export async function askSelectTime(tgChat: TgChat, onDone: (time: string) => void) {
  const msg = tgChat.app.i18n.menu.selectTime;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN
    ]
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
        })
      ),
      AppEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.MESSAGE,
        tgChat.asyncCb(async (message: string) => {
          const trimmed = _.trim(message);

          try {
            validateTime(trimmed);
          }
          catch (e) {
            await tgChat.reply(tgChat.app.i18n.menu.incorrectTime)

            return;
          }

          onDone(message);
        })
      ),
      AppEvents.MESSAGE
    ]);
  });

}
