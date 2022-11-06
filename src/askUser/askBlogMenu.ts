import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';


export const BLOG_MENU_ACTIONS = {
  CONTENT_PLAN: 'CONTENT_PLAN',
  STORY: 'STORY',
  MEM: 'MEM',
  REEL: 'REEL',
  POST: 'POST',
  ADVERT: 'ADVERT',
};
// export const MENU_PUBLISH = 'menu_publish';
// export const MENU_MAKE_STORY = 'menu_make_story';
// export const MENU_ADVERT = 'menu_advert';


export async function askBlogMenu(blogName: string, tgChat: TgChat, onDone: (action: string) => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(blogName, tgChat));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if ([
            BLOG_MENU_ACTIONS.CONTENT_PLAN,
            BLOG_MENU_ACTIONS.STORY,
            BLOG_MENU_ACTIONS.MEM,
            BLOG_MENU_ACTIONS.REEL,
            BLOG_MENU_ACTIONS.POST,
            BLOG_MENU_ACTIONS.ADVERT,
          ].includes(queryData)) {
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

async function printInitialMessage(blogName: string, tgChat: TgChat): Promise<number> {
  const blogSns = tgChat.app.config.blogs[blogName].sn;

  return tgChat.reply(tgChat.app.i18n.menu.blogMenu, [
    [
      {
        text: tgChat.app.i18n.menu.publish,
        callback_data: BLOG_MENU_ACTIONS.CONTENT_PLAN,
      },
    ],
    (blogSns.instagram && blogSns.telegram)
      ? [{
          text: tgChat.app.i18n.menu.makeStory,
          callback_data: BLOG_MENU_ACTIONS.STORY,
        }]
      : [],
    (blogSns.telegram)
      ?[{
        text: tgChat.app.i18n.menu.makeMem,
        callback_data: BLOG_MENU_ACTIONS.MEM,
      }]
      : [],
    (blogSns.telegram)
      ?[{
        text: tgChat.app.i18n.menu.makeReel,
        callback_data: BLOG_MENU_ACTIONS.REEL,
      }]
      : [],
    (blogSns.telegram)
      ?[{
        text: tgChat.app.i18n.menu.makeReel,
        callback_data: BLOG_MENU_ACTIONS.POST,
      }]
      : [],
    (blogSns.telegram)
      ?[{
        text: tgChat.app.i18n.menu.makeAdvertTg,
        callback_data: BLOG_MENU_ACTIONS.ADVERT,
      }]
      : [],
    [
      CANCEL_BTN,
    ],
  ]);
}
