import TgChat from '../../apiTg/TgChat.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';
import {addSimpleStep, compactButtons} from '../../helpers/helpers.js';


export const CUSTOM_POST_MENU_ACTIONS = {
  POST1000: 'POST1000',
  POST2000: 'POST2000',
  MEM: 'MEM',
  PHOTOS: 'PHOTOS',
  STORY: 'STORY',
  POLL: 'POLL',
  REEL: 'REEL',
};


export async function askCustomTgPostMainMenu(blogName: string, tgChat: TgChat, onDone: (action: string) => void) {
  const blogSns = tgChat.app.blogs[blogName].sn;
  const msg = tgChat.app.i18n.menu.customPostTgMenu;
  const buttons = compactButtons([
    [
      {
        text: tgChat.app.i18n.menu.makePost1000,
        callback_data: CUSTOM_POST_MENU_ACTIONS.POST1000,
      },
      {
        text: tgChat.app.i18n.menu.makePost2000,
        callback_data: CUSTOM_POST_MENU_ACTIONS.POST2000,
      }
    ],
    [
      {
        text: tgChat.app.i18n.menu.makePhotos,
        callback_data: CUSTOM_POST_MENU_ACTIONS.PHOTOS,
      },
    ],
    [
      {
        text: tgChat.app.i18n.menu.makeMem,
        callback_data: CUSTOM_POST_MENU_ACTIONS.MEM,
      },
      {
        text: tgChat.app.i18n.menu.makePollTg,
        callback_data: CUSTOM_POST_MENU_ACTIONS.POLL,
      },
    ],
    [
      blogSns.instagram && {
        text: tgChat.app.i18n.menu.makeStory,
        callback_data: CUSTOM_POST_MENU_ACTIONS.STORY,
      },
      {
        text: tgChat.app.i18n.menu.makeReel,
        callback_data: CUSTOM_POST_MENU_ACTIONS.REEL,
      }
    ],
    [
      BACK_BTN,
      CANCEL_BTN,
    ],
  ]);

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    else if (queryData === BACK_BTN_CALLBACK) {
      return tgChat.steps.back();
    }
    else if (Object.keys(CUSTOM_POST_MENU_ACTIONS).includes(queryData)) {
      return onDone(queryData);
    }
  });
}
