import _ from 'lodash';
import TgChat from '../../apiTg/TgChat';
import BaseState from '../../types/BaseState';
import {ChatEvents} from '../../types/constants';
import {
  PhotoMessageEvent,
  TextMessageEvent,
  VideoMessageEvent
} from '../../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {isValidUrl} from '../../lib/common';
import {MediaGroupItem} from '../../types/types';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  makeOkBtn, OK_BTN_CALLBACK,
  SKIP_BTN_CALLBACK
} from '../../helpers/buttons';
import {convertTgInputToHtml} from '../../helpers/convertTgInputToHtml';


export type AskPostMediaDone = (mediaGroup: MediaGroupItem[], captionHtml?: string) => void


export async function askPostMedia(
  tgChat: TgChat,
  mediaRequired: boolean,
  onlyOneImage: boolean,
  onDone: AskPostMediaDone,
  skipBtnLabel?: string
) {
  const msg = (onlyOneImage)
    ? tgChat.app.i18n.menu.uploadOne
    : tgChat.app.i18n.menu.uploadSeveral
  const buttons = [
    (!mediaRequired)
      ? [{
        text: (skipBtnLabel) ? skipBtnLabel : tgChat.app.i18n.buttons.postMediaSkip,
        callback_data: SKIP_BTN_CALLBACK,
      }] : [],
    [
      makeBackBtn(tgChat.app.i18n),
      makeCancelBtn(tgChat.app.i18n),
      makeOkBtn(tgChat.app.i18n),
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
          if (photoMsg.caption && !captionHtml) {
            captionHtml = convertTgInputToHtml(
              photoMsg.caption,
              photoMsg.entities
            )
          }

          if (!onlyOneImage) {
            mediaGroup.push(photoMsg.photo);
          }
          else if (!mediaGroup.length) {
            mediaGroup[0] = photoMsg.photo

            onDone(mediaGroup, captionHtml)
          }
        })
      ),
      ChatEvents.PHOTO
    ]);
    // listen to video
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.VIDEO,
        tgChat.asyncCb(async (videoMsg: VideoMessageEvent) => {
          if (videoMsg.caption && !captionHtml) {
            captionHtml = convertTgInputToHtml(
              videoMsg.caption,
              videoMsg.entities
            )
          }

          if (!onlyOneImage) {
            mediaGroup.push(videoMsg.video);
          }
          else if (!mediaGroup.length) {
            mediaGroup[0] = videoMsg.video

            onDone(mediaGroup, captionHtml)
          }
        })
      ),
      ChatEvents.VIDEO
    ]);
    // listen to url
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          const text = _.trim(textMsg.text);

          if (!isValidUrl(text)) {
            await tgChat.reply(tgChat.app.i18n.errors.incorrectUrl)

            return
          }

          const medias: MediaGroupItem[] = text.split('\n')
            .map((el) => _.trim(el))
            .filter((el) => Boolean(el))
            .map((url) => ({ type: 'photoUrl', url }));

          if (!onlyOneImage) {
            for (const item of medias) mediaGroup.push(item);
          }
          else if (!mediaGroup.length) {
            mediaGroup[0] = medias[0]

            onDone(mediaGroup, captionHtml)
          }
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

// async function toNextStep(tgChat: TgChat) {
//   await tgChat.reply(
//     tgChat.app.i18n.message.waitImagesAndPressOk,
//     [[makeOkBtn(tgChat.app.i18n)]]
//   )
// }
