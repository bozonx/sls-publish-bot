import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK, ChatEvents, OK_BTN} from '../types/constants.js';
import BaseState from '../types/BaseState.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../types/MessageEvent.js';
import {askDateTime} from './askDateTime.js';
import {handleIncomeMessage} from './askTaskAdd.js';


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

          // TODO: use askClosePoll

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
