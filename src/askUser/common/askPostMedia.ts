import _ from 'lodash';
import TgChat from '../../apiTg/TgChat.js';
import BaseState from '../../types/BaseState.js';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../../types/constants.js';
import {
  PhotoMessageEvent,
  TextMessageEvent,
  VideoMessageEvent
} from '../../types/MessageEvent.js';
import {isValidUrl} from '../../lib/common.js';
import {transformMdToTelegramMd} from '../../helpers/transformMdToTelegramMd.js';
import {MediaGroupItem} from '../../types/types.js';


export type AskPostMediaDone = (mediaGroup: MediaGroupItem[], captionHtml?: string) => void

export const POST_MEDIA_ACTION = {
  SKIP: 'SKIP',
};


export async function askPostMedia(
  tgChat: TgChat,
  mediaRequired: boolean,
  onlyOneImage: boolean,
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
      OK_BTN,
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    const mediaGroup: MediaGroupItem[] = []
    let captionHtml: string | undefined

    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {

          // TODO: поидее надо использовать entities и форматировать

          if (photoMsg.caption) captionHtml = photoMsg.caption;

          mediaGroup.push(photoMsg.photo);
        })
      ),
      ChatEvents.PHOTO
    ]);
    // listen to video
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.VIDEO,
        tgChat.asyncCb(async (photoMsg: VideoMessageEvent) => {

          // TODO: поидее надо использовать entities и форматировать

          if (photoMsg.caption) captionHtml = photoMsg.caption;

          mediaGroup.push(photoMsg.video);
        })
      ),
      ChatEvents.VIDEO
    ]);
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(
          async (cbData: string) => handleButtons(cbData, tgChat, onDone, mediaGroup, captionHtml)
        )
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    // listen to url
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          const text = _.trim(textMsg.text);

          if (isValidUrl(text)) {
            text.split('\n')
              .map((el) => _.trim(el))
              .filter((el) => Boolean(el))
              .forEach((url) => mediaGroup.push({
                type: 'photoUrl',
                url
              }));
          }
          else {

            // TODO: remake

            captionHtml = transformMdToTelegramMd(text);
          }
        })
      ),
      ChatEvents.TEXT
    ]);
  });
}


async function handleButtons(
  cbData: string,
  tgChat: TgChat,
  onDone: AskPostMediaDone,
  mediaGroup: MediaGroupItem[],
  captionHtml?: string
) {
  if (cbData === CANCEL_BTN_CALLBACK) {
    return tgChat.steps.cancel();
  }
  else if (cbData === BACK_BTN_CALLBACK) {
    return tgChat.steps.back();
  }
  else if (cbData === POST_MEDIA_ACTION.SKIP) {
    return onDone([]);
  }
  else if (cbData === OK_BTN_CALLBACK) {
    return onDone(mediaGroup, captionHtml);
  }
}
