import TgChat from '../tgApi/TgChat';
import {makeBaseState} from '../helpers/helpers';
import BaseState from '../types/BaseState';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN, CANCEL_BTN_CALLBACK,
  MENU_MANAGE_SITE,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../types/consts';


export async function askPublishConfirm(tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
        if (queryData === BACK_BTN_CALLBACK) {
          return tgChat.steps.back()
            .catch((e) => {throw e});
        }
        else if (queryData === CANCEL_BTN_CALLBACK) {
          return tgChat.steps.cancel()
            .catch((e) => {throw e});
        }
        else if (queryData === OK_BTN_CALLBACK) {
          onDone();
        }
      }),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectChannel, [
    [
      BACK_BTN,
      CANCEL_BTN,
      OK_BTN
    ]
  ]);
}
