import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents} from '../types/constants';
import {PhotoMessageEvent, TextMessageEvent} from '../types/MessageEvent';
import {isValidUrl} from '../helpers/helpers';
import _ from 'lodash';


export async function askStoryImage(
  blogName: string,
  tgChat: TgChat,
  onDone: (photoMsg: PhotoMessageEvent | string) => void,
) {
  const msg = tgChat.app.i18n.story.upload;

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg));
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => onDone(photoMsg))
      ),
      AppEvents.PHOTO
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
