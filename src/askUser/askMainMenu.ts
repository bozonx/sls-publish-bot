import TgChat from '../apiTg/TgChat.js';
import {addSimpleStep} from '../helpers/helpers.js';


export const MAIN_MENU_ACTION = {
  SITE: 'SITE',
  TASKS: 'TASKS',
  TELEGRAPH: 'TELEGRAPH',
};

const BLOG_MARKER = 'blog:';


export async function askMainMenu(tgChat: TgChat, onDone: (blogNameOrAction: string) => void) {
  const msg = tgChat.app.i18n.menu.mainMenu;
  const buttons = [
    Object.keys(tgChat.app.blogs).map((blogName): any => {
      return {
        text: tgChat.app.blogs[blogName].dispname,
        callback_data: BLOG_MARKER + blogName,
      };
    }),
    // [
    //   {
    //     text: tgChat.app.i18n.menu.selectManageSite,
    //     callback_data: MAIN_MENU_ACTION.SITE,
    //   },
    // ],
    [
      // {
      //   text: tgChat.app.i18n.menu.selectManageTelegraph,
      //   callback_data: MAIN_MENU_ACTION.TELEGRAPH,
      // },
      {
        text: tgChat.app.i18n.menu.selectManageTasks,
        callback_data: MAIN_MENU_ACTION.TASKS,
      }
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons, tgChat.asyncCb(async (queryData: string) => {
    if (queryData.indexOf(BLOG_MARKER) === 0) {
      const splat: string[] = queryData.split(':');
      const blogName: string = splat[1];

      // print result
      await tgChat.reply(
        tgChat.app.i18n.menu.selectedBlog
        + tgChat.app.blogs[blogName].dispname
      );

      onDone(blogName);
    }
    else if (Object.keys(MAIN_MENU_ACTION).includes(queryData)) {
      onDone(queryData);
    }
  }));
}
