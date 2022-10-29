import TgChat from '../tgApi/TgChat';
import {makeBaseState} from '../helpers/helpers';
import BaseState from '../types/BaseState';
import {AppEvents, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/consts';


export const MENU_PUBLISH = 'menu_publish';
export const MENU_MAKE_STORY = 'menu_make_story';


export async function askChannelMenu(tgChat: TgChat, onDone: (action: string) => void) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
        if ([MENU_PUBLISH, MENU_MAKE_STORY].includes(queryData)) {
          onDone(queryData);
        }
        else if (queryData === CANCEL_BTN_CALLBACK) {
          return tgChat.steps.cancel()
            .catch((e) => {throw e});
        }
      }),
      AppEvents.CALLBACK_QUERY,
    ]);

  });
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectChannel, [
    [
      {
        text: tgChat.app.i18n.menu.publish,
        callback_data: MENU_PUBLISH,
      }
    ],
    [
      {
        text: tgChat.app.i18n.menu.makeStory,
        callback_data: MENU_MAKE_STORY,
      }
    ],
    [
      CANCEL_BTN,
    ]
  ]);
}
