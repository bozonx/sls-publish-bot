import TgChat from '../apiTg/TgChat';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import BaseState from '../types/BaseState';
import {PollMessageEvent} from '../types/MessageEvent';


export async function askPoll(tgChat: TgChat, onDone: () => void) {
  const msg = tgChat.app.i18n.menu.makePoll;
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
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          // TODO: !!!!

        })
      ),
      AppEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.POLL,
        tgChat.asyncCb(async (message: PollMessageEvent) => {

        })
      ),
      AppEvents.TEXT
    ]);
  });

}
