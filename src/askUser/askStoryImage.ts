import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents} from '../types/constants';
import {PhotoMessageEvent} from '../types/MessageEvent';


export async function askStoryImage(
  blogName: string,
  tgChat: TgChat,
  onDone: () => void,
) {
  const msg = tgChat.app.i18n.story.upload;

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.PHOTO,
        tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {
          console.log(1111, photoMsg)
        })
      ),
      AppEvents.PHOTO
    ]);
  });
}
