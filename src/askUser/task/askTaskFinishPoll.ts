import TgChat from '../../apiTg/TgChat.js';
import {ChatEvents} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {PollMessageEvent} from '../../types/MessageEvent.js';
import {handleIncomeMessage} from '../common/askSharePost.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';


type OnDoneType = (messageId: number, chatId: number, startTime: string) => void;


export async function askTaskFinishPoll(msg: string, tgChat: TgChat, onDone: OnDoneType) {
  const buttons = [
    [
      makeBackBtn(tgChat.app.i18n),
      makeCancelBtn(tgChat.app.i18n),
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to poll message
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.POLL,
        tgChat.asyncCb(async (pollMsg: PollMessageEvent) => {
          await handleIncomeMessage(
            [pollMsg.messageId],
            pollMsg.chatId,
            tgChat,
            (messageIds: number[], chatId: number, startTime: string) => onDone(
              messageIds[0],
              chatId,
              startTime
            )
          );
        })
      ),
      ChatEvents.POLL,
    ]);
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (cbData: string) => {
          if (cbData === CANCEL_BTN_CALLBACK) {
            await tgChat.steps.cancel();
          }
          else if (cbData === BACK_BTN_CALLBACK) {
            await tgChat.steps.back();
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}
