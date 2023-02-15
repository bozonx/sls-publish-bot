import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import BaseState from '../../types/BaseState.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../../types/MessageEvent.js';
import {askDateTime} from './askDateTime.js';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  makeOkBtn,
  OK_BTN_CALLBACK
} from '../../helpers/buttons.js';
import {ChatEvents} from '../../types/constants.js';


type OnDoneType = (messageIds: number[], chatId: number, startTime: string) => void;


export async function askSharePost(msg: string, tgChat: TgChat, onDone: OnDoneType) {
  const buttons = [
    [
      makeBackBtn(tgChat.app.i18n),
      makeCancelBtn(tgChat.app.i18n),
      makeOkBtn(tgChat.app.i18n),
    ]
  ];
  let mediaIds: number[] = []
  let chatId: number

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to text message
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          chatId = textMsg.chatId
          mediaIds = [textMsg.messageId]
        })
      ),
      ChatEvents.TEXT,
    ]);
    // listen to photo message
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {
          chatId = photoMsg.chatId
          mediaIds.push(photoMsg.messageId)
        })
      ),
      ChatEvents.PHOTO,
    ]);
    // listen to video message
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.VIDEO,
        tgChat.asyncCb(async (videoMsg: VideoMessageEvent) => {
          chatId = videoMsg.chatId
          mediaIds.push(videoMsg.messageId)
        })
      ),
      ChatEvents.VIDEO,
    ]);
    // listen to poll message
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.POLL,
        tgChat.asyncCb(async (pollMsg: PollMessageEvent) => {
          chatId = pollMsg.chatId
          mediaIds = [pollMsg.messageId]
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
          else if (cbData === OK_BTN_CALLBACK) {
            if (!mediaIds.length) {
              await tgChat.reply(tgChat.app.i18n.errors.noImageNoText)

              return
            }

            return await handleIncomeMessage(mediaIds, chatId, tgChat, onDone);
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}


export async function handleIncomeMessage(messageIds: number[], chatId: number, tgChat: TgChat, onDone: OnDoneType) {
  await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
    onDone(
      messageIds,
      chatId,
      moment(`${isoDate} ${time}`).utcOffset(tgChat.app.appConfig.utcOffset).format()
    );
  }), tgChat.app.i18n.message.maxTaskTime);
}
