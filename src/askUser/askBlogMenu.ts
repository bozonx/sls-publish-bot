import TgChat from '../apiTg/TgChat';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {addSimpleStep, compactButtons} from '../helpers/helpers';


export const BLOG_MENU_ACTIONS = {
  CONTENT_PLAN: 'CONTENT_PLAN',
  STORY: 'STORY',
  MEM: 'MEM',
  REEL: 'REEL',
  POLL: 'POLL',
  POST: 'POST',
  BUY_AD: 'BUY_AD',
  SELL_AD_PLACE: 'SELL_AD_PLACE',
};


export async function askBlogMenu(blogName: string, tgChat: TgChat, onDone: (action: string) => void) {
  const blogSns = tgChat.app.blogs[blogName].sn;
  const msg = tgChat.app.i18n.menu.blogMenu;
  const buttons = compactButtons([
    [{
      text: tgChat.app.i18n.menu.publish,
      callback_data: BLOG_MENU_ACTIONS.CONTENT_PLAN,
    }],
    blogSns.telegram && [
      blogSns.instagram && {
        text: tgChat.app.i18n.menu.makeStory,
        callback_data: BLOG_MENU_ACTIONS.STORY,
      },
      {
        text: tgChat.app.i18n.menu.makeReel,
        callback_data: BLOG_MENU_ACTIONS.REEL,
      }
    ],
    blogSns.telegram && [
      {
        text: tgChat.app.i18n.menu.makeMem,
        callback_data: BLOG_MENU_ACTIONS.MEM,
      },
      {
        text: tgChat.app.i18n.menu.makePost,
        callback_data: BLOG_MENU_ACTIONS.POST,
      }
    ],
    blogSns.telegram && [{
      text: tgChat.app.i18n.menu.makePollTg,
      callback_data: BLOG_MENU_ACTIONS.POLL,
    }],
    blogSns.telegram && [{
      text: tgChat.app.i18n.menu.buyAdvertTg,
      callback_data: BLOG_MENU_ACTIONS.BUY_AD,
    }],
    blogSns.telegram && [{
      text: tgChat.app.i18n.menu.sellAdvertTg,
      callback_data: BLOG_MENU_ACTIONS.SELL_AD_PLACE,
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
