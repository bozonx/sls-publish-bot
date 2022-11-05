import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents} from '../types/constants';


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
        AppEvents.MESSAGE,
        tgChat.asyncCb(async (queryData: string) => {
          console.log(1111, queryData)
        })
      ),
      AppEvents.MESSAGE
    ]);
  });
}
