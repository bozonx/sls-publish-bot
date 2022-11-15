import BaseState from '../types/BaseState';
import {ChatEvents} from '../types/constants';
import TgChat from '../apiTg/TgChat';


export const MAIN_MENU_ACTION = {
  SITE: 'SITE',
  TASKS: 'TASKS',
  TELEGRAPH: 'TELEGRAPH',
};

const BLOG_MARKER = 'blog:';


export async function askMainMenu(tgChat: TgChat, onDone: (blogNameOrAction: string) => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(tgChat));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData.indexOf(BLOG_MARKER) === 0) {
            await blogSelected(queryData, tgChat, onDone);
          }
          else {
            onDone(queryData);
          }
        }
      )),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}

async function blogSelected(
  queryData: string,
  tgChat: TgChat,
  onDone: (blogNameOrAction: string) => void
) {
  const splat: string[] = queryData.split(':');
  const blogName: string = splat[1];

  // print result
  await tgChat.reply(
    tgChat.app.i18n.menu.selectedBlog
    + tgChat.app.config.blogs[blogName].dispname
  );

  onDone(blogName);
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.mainMenu, [
    Object.keys(tgChat.app.config.blogs).map((blogName): any => {
      return {
        text: tgChat.app.config.blogs[blogName].dispname,
        callback_data: BLOG_MARKER + blogName,
      };
    }),
    [
      {
        text: tgChat.app.i18n.menu.selectManageSite,
        callback_data: MAIN_MENU_ACTION.SITE,
      },
    ],
    [
      {
        text: tgChat.app.i18n.menu.selectManageTelegraph,
        callback_data: MAIN_MENU_ACTION.TELEGRAPH,
      },
      {
        text: tgChat.app.i18n.menu.selectManageTasks,
        callback_data: MAIN_MENU_ACTION.TASKS,
      }
    ]
  ]);
}
