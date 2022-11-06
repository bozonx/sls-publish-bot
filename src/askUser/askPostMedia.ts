import _ from 'lodash';
import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {PhotoMessageEvent, TextMessageEvent} from '../types/MessageEvent';
import {isValidUrl} from '../helpers/helpers';


export type AskPostMediaDone = (photoIdOrUrl: string[], caption?: string) => void

export const POST_MEDIA_ACTION = {
  SKIP: 'SKIP',
};


export async function askPostMedia(
  mediaRequired: boolean,
  blogName: string,
  tgChat: TgChat,
  onDone: AskPostMediaDone,
) {
  const msg = tgChat.app.i18n.story.upload;
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
    // TODO: add video
    // TODO: поддержка расшаренного поста с текстом
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {

          // TODO: если их несколько ????

          return onDone([photoMsg.photo.fileId], photoMsg.caption);
        })
      ),
      AppEvents.PHOTO
    ]);
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (cbData: string) => handleButtons(cbData, tgChat, onDone))
      ),
      AppEvents.CALLBACK_QUERY
    ]);
    // listen to url
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.TEXT,
        tgChat.asyncCb(
          async (textMsg: TextMessageEvent) => handleText(textMsg, tgChat, onDone)
        )
      ),
      AppEvents.TEXT
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
    return onDone([]);
  }
}

async function handleText(textMsg: TextMessageEvent, tgChat: TgChat, onDone: AskPostMediaDone) {
  const url = _.trim(textMsg.text);

  // TODO: поддержка несколько ссылок через перенос строки

  if (isValidUrl(url)) {
    onDone([url]);
  }
  else {
    await tgChat.reply(tgChat.app.i18n.errors.incorrectUrl);
  }
}