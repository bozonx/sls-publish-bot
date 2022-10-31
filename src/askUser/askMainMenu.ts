import BaseState from '../types/BaseState';
import {AppEvents, MENU_MANAGE_SITE} from '../types/constants';
import TgChat from '../apiTg/TgChat';


export const SITE_SELECTED_RESULT = '!site';
const BLOG_MARKER = 'blog:';


export async function askMainMenu(tgChat: TgChat, onDone: (blogName: string) => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(tgChat));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === MENU_MANAGE_SITE) {
            onDone(SITE_SELECTED_RESULT);
          }
          else if (queryData.indexOf(BLOG_MARKER) === 0) {
            await handleChannelSelected(queryData, tgChat, onDone);
          }
          // else do nothing
        }
      )),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

async function handleChannelSelected(
  queryData: string,
  tgChat: TgChat,
  onDone: (blogName: string) => void
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
        callback_data: MENU_MANAGE_SITE,
      }
    ]
  ]);
}
