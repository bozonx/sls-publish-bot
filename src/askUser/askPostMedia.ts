import _ from 'lodash';
import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {ChatEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {PhotoMessageEvent, TextMessageEvent, VideoMessageEvent} from '../types/MessageEvent';
import {isValidUrl} from '../lib/common';


interface AskPostMediaReturn {
  photoIdOrUrl?: string[],
  videoId?: string,
  caption?: string
}

export type AskPostMediaDone = (data: AskPostMediaReturn) => void

export const POST_MEDIA_ACTION = {
  SKIP: 'SKIP',
};


export async function askPostMedia(
  mediaRequired: boolean,
  onlyOneImage: boolean,
  blogName: string,
  tgChat: TgChat,
  onDone: AskPostMediaDone,
) {
  const msg = (onlyOneImage)
    ? tgChat.app.i18n.menu.uploadOne
    : tgChat.app.i18n.menu.uploadSeveral;
  const buttons = [
    (!mediaRequired)
      ? [{
        text: tgChat.app.i18n.buttons.postMediaSkip,
        callback_data: POST_MEDIA_ACTION.SKIP,
      }] : [],
    [
      BACK_BTN,
      CANCEL_BTN,
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // TODO: поддержка расшаренного поста с текстом
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {

          // TODO: если их несколько ????

          return onDone({
            photoIdOrUrl: [photoMsg.photo.fileId],
            caption: photoMsg.caption
          });
        })
      ),
      ChatEvents.PHOTO
    ]);
    // listen to video
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.VIDEO,
        tgChat.asyncCb(async (photoMsg: VideoMessageEvent) => {

          // TODO: если их несколько ????

          return onDone({
            videoId: photoMsg.video.fileId,
            caption: photoMsg.caption,
          });
        })
      ),
      ChatEvents.VIDEO
    ]);
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (cbData: string) => handleButtons(cbData, tgChat, onDone))
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    // listen to url
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(
          async (textMsg: TextMessageEvent) => handleText(textMsg, tgChat, onDone)
        )
      ),
      ChatEvents.TEXT
    ]);
  });
}


async function handleButtons(cbData: string, tgChat: TgChat, onDone: AskPostMediaDone) {
  if (cbData === CANCEL_BTN_CALLBACK) {
    return tgChat.steps.cancel();
  }
  else if (cbData === BACK_BTN_CALLBACK) {
    return tgChat.steps.back();
  }
  else if (cbData === POST_MEDIA_ACTION.SKIP) {
    return onDone({});
  }
}

async function handleText(textMsg: TextMessageEvent, tgChat: TgChat, onDone: AskPostMediaDone) {
  const url = _.trim(textMsg.text);

  // TODO: поддержка несколько ссылок через перенос строки

  if (isValidUrl(url)) {
    onDone({photoIdOrUrl: [url]});
  }
  else {
    await tgChat.reply(tgChat.app.i18n.errors.incorrectUrl);
  }
}