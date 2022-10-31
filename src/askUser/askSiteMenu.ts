import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';


export async function askSiteMenu(tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
            if (queryData === CANCEL_BTN_CALLBACK) {
              return tgChat.steps.cancel();
            }
            // else do nothing
          }
        )),
      AppEvents.CALLBACK_QUERY
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
