import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/consts';


export const MENU_PUBLISH = 'menu_publish';
export const MENU_MAKE_STORY = 'menu_make_story';
export const MENU_ADVERT = 'menu_advert';


export async function askChannelMenu(tgChat: TgChat, onDone: (action: string) => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if ([MENU_PUBLISH, MENU_MAKE_STORY, MENU_ADVERT].includes(queryData)) {
            onDone(queryData);
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
        }
      )),
      AppEvents.CALLBACK_QUERY,
    ]);
  });
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.channelMenu, [
    [
      {
        text: tgChat.app.i18n.menu.publish,
        callback_data: MENU_PUBLISH,
      },
    ],
    [
      {
        text: tgChat.app.i18n.menu.makeStory,
        callback_data: MENU_MAKE_STORY,
      },
      {
        text: tgChat.app.i18n.menu.makeAdvert,
        callback_data: MENU_ADVERT,
      },
    ],
    [
      CANCEL_BTN,
    ],
  ]);
}
