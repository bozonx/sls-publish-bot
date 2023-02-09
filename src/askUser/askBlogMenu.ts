import TgChat from '../apiTg/TgChat.js';
import {addSimpleStep, compactButtons} from '../helpers/helpers.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import {CANCEL_BTN_CALLBACK} from '../helpers/buttons.js';


export const BLOG_MENU_ACTIONS = {
  CONTENT_PLAN: 'CONTENT_PLAN',
  CUSTOM_TG_POST: 'CUSTOM_TG_POST',
  BUY_TG_AD: 'BUY_TG_AD',
  SELL_TG_AD_PLACE: 'SELL_TG_AD_PLACE',
};


export async function askBlogMenu(blogName: string, tgChat: TgChat, onDone: (action: string) => void) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      const blogSns = tgChat.app.blogs[blogName].sn

      return [
        tgChat.app.i18n.menu.blogMenu,
        compactButtons([
          [{
            text: tgChat.app.i18n.menu.publish,
            callback_data: BLOG_MENU_ACTIONS.CONTENT_PLAN,
          }],
          blogSns.telegram && [{
            text: tgChat.app.i18n.menu.customTgPostMenu,
            callback_data: BLOG_MENU_ACTIONS.CUSTOM_TG_POST,
          }],
          // blogSns.telegram && [{
          //   text: tgChat.app.i18n.menu.buyAdvertTg,
          //   callback_data: BLOG_MENU_ACTIONS.BUY_TG_AD,
          // }],
          // blogSns.telegram && [{
          //   text: tgChat.app.i18n.menu.sellAdvertTg,
          //   callback_data: BLOG_MENU_ACTIONS.SELL_TG_AD_PLACE,
          // }],
          [
            {
              text: tgChat.app.i18n.buttons.toMainMenu,
              callback_data: CANCEL_BTN_CALLBACK,
            }
          ],
        ])
      ]
    },
    async (queryData: string) => {
      if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel();
      }
      else if (Object.keys(BLOG_MENU_ACTIONS).includes(queryData)) {
        return onDone(queryData);
      }
    }
  );
}
