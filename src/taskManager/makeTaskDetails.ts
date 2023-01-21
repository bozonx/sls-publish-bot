import {PostponeTgPostTask, TaskItem} from '../types/TaskItem.js';
import moment from 'moment/moment.js';
import {PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants.js';
import App from '../App.js';


export async function makeTaskDetails(task: TaskItem, app: App): Promise<string> {
  let username: string | undefined;
  const resultArr = [
    `${app.i18n.commonPhrases.type}${task.type}`,
    `${app.i18n.commonPhrases.dateLabel[task.type]}: ${moment(task.startTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}`
  ];

  if ((task as PostponeTgPostTask).autoDeleteDateTime) {
    resultArr.push(
      `${app.i18n.commonPhrases.autoDeletePostDate}: ${moment((task as PostponeTgPostTask).autoDeleteDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}`
    );
  }

  if ((task as PostponeTgPostTask).closePollDateTime) {
    resultArr.push(
      `${app.i18n.commonPhrases.autoClosePollDate}: ${moment((task as PostponeTgPostTask).closePollDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}`
    );
  }

  if (task.sn) resultArr.push(`${app.i18n.commonPhrases.sn}: ${task.sn}`);
  if (task.chatId) {
    const res = await app.tg.bot.telegram.getChat(task.chatId)

    username = (res as any).username

    resultArr.push(`Chat username: ${username}`);
    resultArr.push(`chatId: ${task.chatId}`);
  }

  if ((task as any).messageId) {
    resultArr.push(`messageId: ${(task as any).messageId}`);

    if (username) {
      resultArr.push(`message url: https://t.me/${username}/${(task as any).messageId}`);
    }
  }

  if ((task as PostponeTgPostTask).forwardMessageId) {
    resultArr.push(`forwardMessageId: ${(task as any).forwardMessageId}`);

    if (username) {
      resultArr.push(`forwardMessage url: https://t.me/${username}/${(task as any).forwardMessageId}`);
    }
  }

  return resultArr.join('\n');
}
