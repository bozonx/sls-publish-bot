import TgChat from '../../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  CANCEL_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK, SKIP_BTN_CALLBACK
} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {PhotoMessageEvent, TextMessageEvent} from '../../types/MessageEvent.js';
import {tgInputToMd} from '../../helpers/tgInputToMd.js';
import _ from 'lodash';


export async function askPostText(
  blogName: string,
  tgChat: TgChat,
  onDone: (text?: string, cleanText?: string) => void,
) {
  const msg = tgChat.app.i18n.menu.askTypeText;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
      {
        text: tgChat.app.i18n.buttons.withoutText,
        callback_data: SKIP_BTN_CALLBACK,
      },
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
          onDone(
            _.trim(tgInputToMd(textMsg.text, textMsg.entities)),
            _.trim(textMsg.text)
          );
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
            onDone(
              _.trim(tgInputToMd(photoMsg.caption, photoMsg.entities)),
              _.trim(photoMsg.caption)
            );
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
            onDone(
              _.trim(tgInputToMd(videoMsg.caption, videoMsg.entities)),
              _.trim(videoMsg.caption)
            );
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
