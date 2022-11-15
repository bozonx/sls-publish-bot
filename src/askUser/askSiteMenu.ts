import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {ChatEvents, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';


export async function askSiteMenu(tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(tgChat));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
            if (queryData === CANCEL_BTN_CALLBACK) {
              return tgChat.steps.cancel();
            }
            // else do nothing
          }
        )),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.siteMenu, [
    [
      CANCEL_BTN,
    ]
  ]);
}
