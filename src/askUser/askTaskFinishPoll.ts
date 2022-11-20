import TgChat from '../apiTg/TgChat';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK, ChatEvents, OK_BTN} from '../types/constants';
import BaseState from '../types/BaseState';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../types/MessageEvent';
import {askDateTime} from './askDateTime';
import moment from 'moment';


type OnDoneType = (messageId: number, chatId: number, startTime: string) => void;


export async function askTaskFinishPoll(msg: string, tgChat: TgChat, onDone: OnDoneType) {
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
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
          await handleIncomeMessage(pollMsg.messageId, pollMsg.chatId, tgChat, onDone);
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


async function handleIncomeMessage(messageId: number, chatId: number, tgChat: TgChat, onDone: OnDoneType) {
  await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
    await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
    onDone(
      messageId,
      chatId,
      moment(`${isoDate} ${time}`).utcOffset(tgChat.app.appConfig.utcOffset).format()
    );
  }));
}
