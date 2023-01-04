import {TaskItem} from '../types/TaskItem.js';
import moment from 'moment/moment.js';
import {PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants.js';
import App from '../App.js';


export async function makeTaskDetails(task: TaskItem, app: App): Promise<string> {
  let result = `${app.i18n.commonPhrases.type}: ${task.type}\n`
    + `${app.i18n.commonPhrases.date}: ${moment(task.startTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}\n`;
  let chatName: string | undefined;

  if (task.chatId) {
    // const res = await app.tg.bot.telegram.getChat(task.chatId)
    //
    // chatName = res.
  }

  if (task.sn) result += `${app.i18n.commonPhrases.sn}: ${task.sn}`;
  if (task.chatId) {
    result += `chatId: ${task.chatId}`;
  }

  if ((task as any).messageId) {
    result += `messageId: ${(task as any).messageId}`;

    if (chatName) {
      result += `message url: https://t.me/${chatName}/${(task as any).messageId}`;
    }
  }

  if ((task as any).forwardMessageId) {
    result += `forwardMessageId: ${(task as any).forwardMessageId}`;

    if (chatName) {
      result += `forwardMessage url: https://t.me/${chatName}/${(task as any).forwardMessageId}`;
    }
  }

  return result;
}
