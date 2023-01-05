import TgChat from '../../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {PollMessageEvent} from '../../types/MessageEvent.js';


export async function askTgPoll(tgChat: TgChat, onDone: (message: PollMessageEvent) => void) {
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
        ChatEvents.POLL,
        tgChat.asyncCb(async (message: PollMessageEvent) => {
          if (message.poll.isClosed) {
            await tgChat.reply(tgChat.app.i18n.errors.pollIsClosed)

            return;
          }

          onDone(message);
        })
      ),
      ChatEvents.TEXT
    ]);
  });

}

