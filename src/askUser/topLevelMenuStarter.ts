import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu.js';
import {startBlogMenu} from './startBlogMenu.js';
import {startTaskListMenu} from './task/startTaskListMenu.js';
import {startTelegraphMenu} from './telegraph/startTelegraphMenu.js';
import {isoDateToHuman} from '../helpers/helpers.js';


export async function topLevelMenuStarter(tgChat: TgChat) {
  await tgChat.reply(
    tgChat.app.i18n.greet + isoDateToHuman(moment().format())
  )

  return askMainMenu(tgChat, tgChat.asyncCb(async (blogNameOrAction: string) => {

    switch (blogNameOrAction) {
      case MAIN_MENU_ACTION.TASKS:
        return startTaskListMenu(tgChat);
      case MAIN_MENU_ACTION.TELEGRAPH:
        return startTelegraphMenu(tgChat);
      default:
        return startBlogMenu(blogNameOrAction, tgChat);
    }
  }));
}
