import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {askMainMenu, MAIN_MENU_ACTION} from './askMainMenu.js';
import {startBlogMenu} from './startBlogMenu.js';
import {startTaskListMenu} from './task/startTaskListMenu.js';
import {startTelegraphMenu} from './telegraph/startTelegraphMenu.js';
import {isoDateToHuman} from '../helpers/helpers.js';


export async function topLevelMenuStarter(tgChat: TgChat) {
  await tgChat.reply(
    tgChat.app.i18n.message.greet
    + isoDateToHuman(moment().utcOffset(tgChat.app.appConfig.utcOffset).format()) + '\n'
    + tgChat.app.i18n.message.localTime
  )



  await test(tgChat)


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


async function test(tgChat: TgChat) {

  /*

    query_id
    The bot can call the Bot API method answerWebAppQuery to send
      an inline message from the user back to the bot and close the Web System
    initData
    elegram.WebApp.themeParams
    headerColor, backgroundColor
    MainButton
    onEvent(eventType, eventHandler)
    openLink(url[, options])
    elegram.WebApp.WebAppInitData
   */

  // await tgChat.app.tg.bot.telegram.sendMessage(
  //   tgChat.botChatId,
  //   'some text',
  //   {
  //     reply_markup: {
  //       //one_time_keyboard: true,
  //       keyboard: [
  //         [
  //           {
  //             text: 'zen',
  //
  //
  //             //The Web System will be able to send a “web_app_data” service message. Available in private chats only.
  //             web_app: {
  //               url: 'http://127.0.0.1:3000/publishZen.html',
  //
  //             }
  //           }
  //         ]
  //       ]
  //     }
  //   }
  // )

  //tgChat.app.tg.bot.telegram.answerWebAppQuery()


}
