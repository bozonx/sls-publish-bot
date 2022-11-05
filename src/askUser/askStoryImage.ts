import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {PhotoMessageEvent, TextMessageEvent} from '../types/MessageEvent';
import {isValidUrl} from '../helpers/helpers';
import _ from 'lodash';


export async function askStoryImage(
  blogName: string,
  tgChat: TgChat,
  onDone: (photoMsg: PhotoMessageEvent | string) => void,
) {
  const msg = tgChat.app.i18n.story.upload;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => onDone(photoMsg))
      ),
      AppEvents.PHOTO
    ]);
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (cbData: string) => {
          if (cbData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          else if (cbData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
        })
      ),
      AppEvents.CALLBACK_QUERY
    ]);
    // listen to url
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          const url = _.trim(textMsg.text);

          if (isValidUrl(url)) {
            onDone(url);
          }
          else {
            await tgChat.reply(tgChat.app.i18n.commonPhrases.incorrectUrl);
          }
        })
      ),
      AppEvents.PHOTO
    ]);
  });
}
