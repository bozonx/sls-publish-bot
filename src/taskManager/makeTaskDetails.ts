import moment from 'moment/moment.js';
import {CloneTgPostTask, PostponeTgPostTask, TaskItem} from '../types/TaskItem.js';
import {PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants.js';
import System from '../System.js';


export async function makeTaskDetails(task: TaskItem, app: System): Promise<string> {
  let username: string | undefined;
  const resultArr = [
    `${app.i18n.commonPhrases.type}${task.type}`,
    `${app.i18n.commonPhrases.dateLabel[task.type]}: `
    + moment(task.startTime)
      .utcOffset(app.appConfig.utcOffset)
      .format(PRINT_SHORT_DATE_TIME_FORMAT)
  ];

  if ((task as PostponeTgPostTask).autoDeleteDateTime) {
    resultArr.push(
      `${app.i18n.commonPhrases.autoDeletePostDate}: `
      + moment((task as PostponeTgPostTask).autoDeleteDateTime)
        .utcOffset(app.appConfig.utcOffset)
        .format(PRINT_SHORT_DATE_TIME_FORMAT)
    );
  }

  if ((task as PostponeTgPostTask).closePollDateTime) {
    resultArr.push(
      `${app.i18n.commonPhrases.autoClosePollDate}: `
      + moment((task as PostponeTgPostTask).closePollDateTime)
        .utcOffset(app.appConfig.utcOffset)
        .format(PRINT_SHORT_DATE_TIME_FORMAT)
    );
  }

  if (task.sn) resultArr.push(`${app.i18n.commonPhrases.sn}: ${task.sn}`);
  if (task.chatId) {
    try {
      const res = await app.tg.bot.telegram.getChat(task.chatId)

      username = (res as any).username

      if (username) resultArr.push(`Chat username: ${username}`)

      resultArr.push(`chatId: ${task.chatId}`)
    }
    catch (e) {
      resultArr.push(`Chat username: CAN'T GET CHAT ${task.chatId}`)
    }
  }
  if ((task as CloneTgPostTask).toChatId) {
    try {
      const res = await app.tg.bot.telegram.getChat((task as CloneTgPostTask).toChatId)

      username = (res as any).username

      if (username) resultArr.push(`To chat username: ${username}`)

      resultArr.push(`To chat id: ${(task as CloneTgPostTask).toChatId}`)
    }
    catch (e) {
      resultArr.push(`Chat username: CAN'T GET TO CHAT ${(task as CloneTgPostTask).toChatId}`)
    }
  }

  if ((task as any).messageId) {
    resultArr.push(`messageId: ${(task as any).messageId}`);

    if (username) {
      resultArr.push(`message url: https://t.me/${username}/${(task as any).messageId}`);
    }
  }
  else if ((task as any).messageIds) {
    resultArr.push(`messageIds: ${(task as any).messageIds.join(', ')}`);

    if (username) {
      resultArr.push(`message url: https://t.me/${username}/${(task as any).messageIds[0]}`);
    }
  }

  if ((task as PostponeTgPostTask).messageIdToCopy) {
    resultArr.push(`messageIdToCopy: ${(task as any).messageIdToCopy}`);

    if (username) {
      resultArr.push(`forwardMessage url: https://t.me/${username}/${(task as any).messageIdToCopy}`);
    }
  }

  return resultArr.join('\n');
}
