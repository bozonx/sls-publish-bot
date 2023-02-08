import TgChat from '../apiTg/TgChat.js';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu.js';
import {startBlogMenu} from './startBlogMenu.js';
import {startTaskMenu} from './task/startTaskMenu.js';
import {startTelegraphMenu} from './telegraph/startTelegraphMenu.js';


export async function topLevelMenuStarter(tgChat: TgChat) {
  return askMainMenu(tgChat, tgChat.asyncCb(async (blogNameOrAction: string) => {

    // tgChat.app.tg.bot.telegram.sendMessage(
    //   tgChat.botChatId,
    //   await convertCommonMdToTgHtml(
    //   '\n\nnorm *bold _italic2_*\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm'
    //   ) || '',
    //   {
    //     parse_mode: 'HTML'
    //   }
    // )

    switch (blogNameOrAction) {
      case MAIN_MENU_ACTION.TASKS:
        return startTaskMenu(tgChat);
      case MAIN_MENU_ACTION.TELEGRAPH:
        return startTelegraphMenu(tgChat);
      default:
        return startBlogMenu(blogNameOrAction, tgChat);
    }
  }));
}
