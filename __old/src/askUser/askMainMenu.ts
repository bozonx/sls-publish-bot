import TgChat from '../apiTg/TgChat'
import {addSimpleStep} from '../helpers/helpers'
import {TgReplyButton} from '../types/TgReplyButton'
import * as querystring from 'querystring';


export const MAIN_MENU_ACTION = {
  TASKS: 'TASKS',
  TELEGRAPH: 'TELEGRAPH',
};

const BLOG_MARKER = 'blog:'


export async function askMainMenu(tgChat: TgChat, onDone: (blogNameOrAction: string) => void) {
  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      return [
        tgChat.app.i18n.menu.mainMenu,
        [
          Object.keys(tgChat.app.blogs).map((blogName): any => {
            return {
              text: tgChat.app.blogs[blogName].dispname,
              callback_data: BLOG_MARKER + blogName,
            };
          }),
          [
            {
              text: tgChat.app.i18n.menu.selectManageTelegraph,
              callback_data: MAIN_MENU_ACTION.TELEGRAPH,
            },
            {
              text: tgChat.app.i18n.menu.selectManageTasks,
              callback_data: MAIN_MENU_ACTION.TASKS,
            }
          ],

          ...await tgChat.app.telegramMenuRenderer.makeInlineKeys()
        ]
      ]
    },
    tgChat.asyncCb(async (queryData: string) => {
      tgChat.app.telegramMenuRenderer.handleClick(queryData)

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
    })
  );
}
