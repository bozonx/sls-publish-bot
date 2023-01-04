import {TaskItem} from '../types/TaskItem.js';
import moment from 'moment/moment.js';
import {PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants.js';
import App from '../App.js';


export async function makeTaskDetails(task: TaskItem, app: App): Promise<string> {
  let username: string | undefined;
  const resultArr = [
    `${app.i18n.commonPhrases.type}: ${task.type}`,
    `${app.i18n.commonPhrases.date}: ${moment(task.startTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}`
  ];

  if (task.sn) resultArr.push(`${app.i18n.commonPhrases.sn}: ${task.sn}`);
  if (task.chatId) {
    const res = await app.tg.bot.telegram.getChat(task.chatId)

    username = (res as any).username

    resultArr.push(`chatId: ${task.chatId}`);
    resultArr.push(`username: ${username}`);
  }

  if ((task as any).messageId) {
    resultArr.push(`messageId: ${(task as any).messageId}`);

    if (username) {
      resultArr.push(`message url: https://t.me/${username}/${(task as any).messageId}`);
    }
  }

  if ((task as any).forwardMessageId) {
    resultArr.push(`forwardMessageId: ${(task as any).forwardMessageId}`);

    if (username) {
      resultArr.push(`forwardMessage url: https://t.me/${username}/${(task as any).forwardMessageId}`);
    }
  }

  return resultArr.join('\n');
}
