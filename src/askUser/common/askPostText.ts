import TgChat from '../../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  CANCEL_BTN,
  SKIP_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK, SKIP_BTN_CALLBACK
} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {PhotoMessageEvent, TextMessageEvent} from '../../types/MessageEvent.js';
import {tgInputToMd} from '../../helpers/tgInputToMd.js';


export async function askPostText(
  blogName: string,
  tgChat: TgChat,
  onDone: (text?: string) => void,
) {
  const msg = tgChat.app.i18n.menu.askTypeText;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
      SKIP_BTN,
    ]
  ];


  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to text
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          onDone(tgInputToMd(textMsg.text, textMsg.entities));
        })
      ),
      ChatEvents.TEXT
    ]);
    // listen to photo for caption
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {
          if (photoMsg.caption) {
            onDone(tgInputToMd(photoMsg.caption, photoMsg.entities));
          }
          else {
            await tgChat.reply(tgChat.app.i18n.message.noMediaCaption)
          }
        })
      ),
      ChatEvents.PHOTO
    ]);
    // listen to video for caption
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.VIDEO,
        tgChat.asyncCb(async (videoMsg: PhotoMessageEvent) => {
          if (videoMsg.caption) {
            onDone(tgInputToMd(videoMsg.caption, videoMsg.entities));
          }
          else {
            await tgChat.reply(tgChat.app.i18n.message.noMediaCaption)
          }
        })
      ),
      ChatEvents.VIDEO
    ]);
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
          else if (queryData === SKIP_BTN_CALLBACK) {
            onDone()
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}
