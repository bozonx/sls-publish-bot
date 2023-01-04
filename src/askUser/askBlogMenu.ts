import TgChat from '../apiTg/TgChat.js';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants.js';
import {addSimpleStep, compactButtons} from '../helpers/helpers.js';


export const BLOG_MENU_ACTIONS = {
  CONTENT_PLAN: 'CONTENT_PLAN',
  CUSTOM_TG_POST: 'CUSTOM_TG_POST',
  BUY_TG_AD: 'BUY_TG_AD',
  SELL_TG_AD_PLACE: 'SELL_TG_AD_PLACE',
};


export async function askBlogMenu(blogName: string, tgChat: TgChat, onDone: (action: string) => void) {
  const blogSns = tgChat.app.blogs[blogName].sn;
  const msg = tgChat.app.i18n.menu.blogMenu;
  const buttons = compactButtons([
    [{
      text: tgChat.app.i18n.menu.publish,
      callback_data: BLOG_MENU_ACTIONS.CONTENT_PLAN,
    }],
    [{
      text: tgChat.app.i18n.menu.customTgPostMenu,
      callback_data: BLOG_MENU_ACTIONS.CUSTOM_TG_POST,
    }],
    blogSns.telegram && [{
      text: tgChat.app.i18n.menu.buyAdvertTg,
      callback_data: BLOG_MENU_ACTIONS.BUY_TG_AD,
    }],
    blogSns.telegram && [{
      text: tgChat.app.i18n.menu.sellAdvertTg,
      callback_data: BLOG_MENU_ACTIONS.SELL_TG_AD_PLACE,
    }],
    [
      CANCEL_BTN,
    ],
  ]);

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    else if (Object.keys(BLOG_MENU_ACTIONS).includes(queryData)) {
      return onDone(queryData);
    }
  });
}
