import _ from 'lodash';
import TgChat from '../../apiTg/TgChat.js';
import BaseState from '../../types/BaseState.js';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  SKIP_BTN_CALLBACK,
  OK_BTN_CALLBACK,
  OK_BTN
} from '../../types/constants.js';
import {
  PhotoMessageEvent,
  TextMessageEvent,
  VideoMessageEvent
} from '../../types/MessageEvent.js';
import {isValidUrl} from '../../lib/common.js';
import {MediaGroupItem} from '../../types/types.js';
import {tgInputToHtml} from '../../helpers/tgInputToHtml.js';


export type AskPostMediaDone = (mediaGroup: MediaGroupItem[], captionHtml?: string) => void


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
        callback_data: SKIP_BTN_CALLBACK,
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
          if (photoMsg.caption && !captionHtml) captionHtml = tgInputToHtml(photoMsg.caption, photoMsg.entities);

          mediaGroup.push(photoMsg.photo);

          //await toNextStep(tgChat)
        })
      ),
      ChatEvents.PHOTO
    ]);
    // listen to video
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.VIDEO,
        tgChat.asyncCb(async (videoMsg: VideoMessageEvent) => {
          if (videoMsg.caption && !captionHtml) captionHtml = tgInputToHtml(videoMsg.caption, videoMsg.entities);

          mediaGroup.push(videoMsg.video);

          //await toNextStep(tgChat)
        })
      ),
      ChatEvents.VIDEO
    ]);
    // listen to url
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {

          // TODO: review

          const text = _.trim(textMsg.text);

          if (!isValidUrl(text)) {
            await tgChat.reply(tgChat.app.i18n.errors.incorrectUrl)

            return
          }

          text.split('\n')
            .map((el) => _.trim(el))
            .filter((el) => Boolean(el))
            .forEach((url) => mediaGroup.push({
              type: 'photoUrl',
              url
            }));

          //await toNextStep(tgChat)
        })
      ),
      ChatEvents.TEXT
    ]);
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(
          async (cbData: string) =>
              handlePrimaryButtons(cbData, tgChat, onDone, mediaGroup, captionHtml)
        )
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}


async function handlePrimaryButtons(
  cbData: string,
  tgChat: TgChat,
  onDone: AskPostMediaDone,
  mediaGroup: MediaGroupItem[],
  captionHtml?: string,
) {
  if (cbData === CANCEL_BTN_CALLBACK) {
    return tgChat.steps.cancel();
  }
  else if (cbData === BACK_BTN_CALLBACK) {
    return tgChat.steps.back();
  }
  else if (cbData === SKIP_BTN_CALLBACK) {
    return onDone([]);
  }
  else if (cbData === OK_BTN_CALLBACK) {
    if (!mediaGroup.length) {
      await tgChat.reply(tgChat.app.i18n.errors.noImage)
    }

    return onDone(mediaGroup, captionHtml);
  }
}

async function toNextStep(tgChat: TgChat) {
  await tgChat.reply(
    tgChat.app.i18n.message.waitImagesAndPressOk,
    [[OK_BTN]]
  )
  // await askConfirm(tgChat, tgChat.asyncCb(async () => {
  //   //return onDone(mediaGroup, captionHtml);
  // }))
}
