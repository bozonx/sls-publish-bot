import TgChat from '../../apiTg/TgChat';
import {ChatEvents} from '../../types/constants';
import BaseState from '../../types/BaseState';
import {PollMessageEvent} from '../../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons';
import {askDateTime} from '../common/askDateTime';
import {makeIsoDateTimeStr} from '../../helpers/helpers';


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
          await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
            onDone(
              pollMsg.messageId,
              pollMsg.chatId,
              makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
            )
          }), tgChat.app.i18n.message.maxTaskTime, undefined, true, true)
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
